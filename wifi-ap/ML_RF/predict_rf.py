import threading
import argparse
import datetime
import psutil
import joblib
import numpy as np
import gc
import logging
import pandas as pd
from sklearn.metrics import pairwise_distances
import time
from collections import Counter
import os
# Charger le modèle RandomForest scikit-learn
def print_memory_usage2():
    mem = psutil.virtual_memory()
    rss = psutil.Process().memory_info().rss
    total_ram_bytes = psutil.virtual_memory().total

    rss_percent = (rss / total_ram_bytes) * 100
    cpu = psutil.cpu_percent(interval=0.1)
    print(f"[INFO] etat RAM machine utilisée : {mem.used / (1024**2):.2f} MB / {mem.total / (1024**2):.2f} MB ({mem.percent}%)")
    print(f"[INFO] CPU utilisé : {cpu:.1f}%")
    print(f"RAM utilisée par le script: {rss / (1024**2):.2f} MB ({(rss_percent):.2f}%)")
    
    return cpu, mem.percent

#cpu_samples = []
#mem_samples = []
#mem_pct = []
#monitoring = True


#process = psutil.Process()

        

def analyze_batch(batch_df, size):
    complexity = {}

    # 1. Nombre total de valeurs NaN
    complexity['nb_nan'] = batch_df.isna().sum().sum()

    # 2. Moyenne des variances par colonne (plus la variance est faible, plus c’est "simple")
    complexity['mean_variance'] = batch_df.var().mean()

    # 3. Nombre de colonnes constantes (peu informatives)
    complexity['nb_constant_cols'] = (batch_df.nunique() <= 1).sum()

    # 4. Distance moyenne entre lignes (si batch pas trop grand)
    if len(batch_df) <= size:  # pour éviter trop de calcul
        distances = pairwise_distances(batch_df.fillna(0))
        complexity['mean_row_distance'] = distances.mean()
    else:
        complexity['mean_row_distance'] = np.nan

    return complexity

gc_triggered = False

def gc_callback(phase, info):
    global gc_triggered
    if phase == "start":
        gc_triggered = True
gc.callbacks.append(gc_callback)


# --- Main Entry ---
def main():
    # ───── ARGUMENTS ────────────────────────────────
    parser = argparse.ArgumentParser()
    parser.add_argument('-in', '--input', required=True, help='Input CSV file')
    parser.add_argument('-b', '--batch', required=True, type=int, help='Input batch size')
    
    args = parser.parse_args()
    
    # ─── Configuration du Logger ─────────────────────────
    log_filename = "predict_rf_metrics.log"
    logging.basicConfig(
        filename=log_filename,
        level=logging.INFO,
        format='[%(asctime)s] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    log = logging.getLogger()
    
    #test = pd.read_csv(args.input)
    #test[label] = test[label].fillna('WRONG')
    # ───── CHARGEMENT DU MODELE ─────────────────────
    data = joblib.load('random_forest_model.pkl')
    rf_model = data['model']
    features = data['features']
    class_labels = data['class_labels']
   
    output_file = f"predictions_{args.batch}.csv"
    
    # ───── INITIALISATION PROCESSUS POUR METRICS ────
    total_inference_time = 0
    all_preds = []
    #all_true = []
    #chunksize = 500
    total_batches = 0
    global gc_triggered
    # Création d’un objet pour surveiller ce processus
    pid = os.getpid()
    process = psutil.Process(pid)
    
     # ───── TRAITEMENT DES BATCHS ────────────────────
    for i, chunk in enumerate(pd.read_csv(args.input, chunksize=args.batch)):
        print(f"[INFO] ----- Traitement du chunk {i} - {len(chunk)} lignes ----")
        #print_memory_usage()
        total_batches += 1
        
        #cpu_samples.clear()
        #mem_samples.clear()
        #mem_pct.clear()
        # ───── Mesure du temps de lecture I/O ────────────────────
        io_start = time.time()
        X_chunk = chunk[features]
        y_true_chunk = chunk['service']
        io_duration_s = time.time() - io_start
        print(f"[INFO] Durée lecture/chargement: {io_duration_s:.4f}s")
        log.info(f"[INFO] Durée lecture/chargement:: {io_duration_s:.4f}s")
        
        #mem_av, cpu_av = print_memory_usage2()
        assert list(X_chunk.columns) == features, "Feature mismatch!"
        
        #start_batch = time.time()
        #start_batch2 = time.perf_counter()
        
        # ───── Mesure time uniquement pour l'inférence ────────────────────
        start_time = datetime.datetime.now()
        
        y_pred = rf_model.predict(X_chunk)
        
        end_time = datetime.datetime.now()
        latency = end_time - start_time
        print(f"[INFO] Durée inférence (CPU pur): {latency.total_seconds():.4f}s")
        
        #end_batch = time.time()
        #end_batch2 = time.perf_counter()
        all_start = time.time()
         # ───── Mesure CPU, Mem total, RSS uniquement pour l'inférence ────────────────────
        cpu = process.cpu_percent(interval=0.1)
        print(f"[INFO] Charge CPU (instantanée): {cpu:.2f}%")
        log.info(f"Durée inférence (CPU pur) : {latency.total_seconds():.4f}s")
        log.info(f"Charge CPU (instantanée) : {cpu:.2f}%")
        
        #mem = process.virtual_memory().percent
        
        # ───── Récupération mémoire (optionnel) ────────────────────
        mem_info = process.memory_info().rss / 1e6
        mem_percent = process.memory_percent()
        print(f"[INFO] Mémoire RSS (résidente): {mem_info:.2f} MB")
        print(f"[INFO] Pourcentage mémoire utilisée par le processus : {mem_percent:.2f}%")
        log.info(f"Mémoire RSS : {mem_info:.2f} MB")
        log.info(f"Pourcentage mémoire utilisée : {mem_percent:.2f}%")
        
        # ───── Garbage Collector ────────────────────
        gc_stats = gc.get_stats()
        gc.collect()
        log.info("GC triggered manuellement")
        log.info(f"gc stats: {gc_stats}")
        
        n_processes = len(psutil.pids())
       
        y_pred_labels = [class_labels[i] for i in y_pred]
        
        
        total_inference_time += latency.total_seconds()
        
         
        #print(f"[BATCH {i}] Durée inférence: {latency.total_seconds():.2f}s | CPU: {cpu}% | MEM: {mem}% | GC: {gc_triggered} | IO: {io_duration_s:.3f}s ")
        #all_true.extend(y_true_chunk.values)
        
        all_preds.extend(y_pred_labels)
        
        class_distribution = Counter(y_pred_labels)
        distribution_dict = dict(class_distribution)
        #vérifier si le contenu des batches influence la charge CPU, analyser de la variabilité des données dans chaque batch.
        stats = analyze_batch(X_chunk, args.batch)
        #print(f" [INFO] Timestamp_end {end_time} - Batch {i+1} : {len(chunk)} lignes -  duration_time : {duration:.4f} sec - duration_perf: {duration2:.4f} sec - duration-datetime : {latency.total_seconds():.4f} sec")
            
        df_results = pd.DataFrame({
             'Batch': [i+1],
             'date_debut': [start_time],
             'date_fin': [end_time],
             'duration_s1':[latency],
             'services_pre':[y_pred_labels],
             'services_tr':[y_true_chunk.values],
             'class_distribution': [distribution_dict],
             'n_processes': [n_processes],
             'io_duration_s': [io_duration_s],
             'gc_triggered': [gc_triggered],
             'mean_variance':[stats['mean_variance']],
             'nb_constant_cols':[stats['nb_constant_cols']],
             'mean_row_dist':[stats['mean_row_distance']]
             })
            

            # Écriture incrémentale dans le fichier CSV
        header = not os.path.exists(output_file)
        df_results.to_csv(output_file, mode='a', index=False, header=header)
        all_duration_s = time.time() - all_start
        print(f"[INFO] Durée lecture/chargement: {all_duration_s:.4f}s")
        log.info(f"[INFO] Durée lecture/chargement:: {all_duration_s:.4f}s")
        #print(f"Durée prédiction       : {duration2:.6f} s")
        #average_cpu = sum(cpu_samples) / len(cpu_samples) if cpu_samples else 0
        #print(f"Charge CPU moyenne pendant la prédiction: {average_cpu:.2f} %")
        
        #average_mem = sum(mem_samples) / len(mem_samples) if mem_samples else 0
        #print(f"Charge mem moyenne pendant la prédiction: {average_mem:.2f} Mo")
        
        #max_cpu = max(cpu_samples) if cpu_samples else 0
        #print(f"CPU max pendant préd.  : {max_cpu:.2f}%")
        
        #max_mem = max(mem_samples) if mem_samples else 0
        #print(f"RSS mémoire max        : {max_mem:.2f} Mo")
        
        #average_pct = sum(mem_pct) / len(mem_pct) if mem_pct else 0
        #print(f"% mem  moyenne pendant la prédiction: {average_pct:.2f} Mo")
        
        #max_pct = max(mem_pct) if mem_pct else 0
        #print(f"CPU max pendant préd.  : {max_pct:.2f}%")
        print("============================================================================================")
        gc_triggered = False
        
    log.info(f"Fin de l'inférence sur {total_batches} batches")
    average_batch_time = total_inference_time / total_batches
   
    print(f"\nTemps moyen par batch : {average_batch_time:.4f} sec")
    #end_time2 = time.time()
    #print(f"Temps total d'inference: {end_time2 - start_time2:.2f} secondes")
 
    # Inference unitaire pour mesurer la latence minimale
    #sample = X_test.iloc[[0]]
   # start_time = time.time()
    #y_pred_single = rf_model.predict(sample)
    #end_time = time.time()
    #single_inference_time = end_time - start_time
    #print(f"Temps unitaire (1 ligne) : {single_inference_time:.6f} sec")
    
    # Utilisation CPU/RAM
    cpu_usage = psutil.cpu_percent()
    ram_usage = psutil.virtual_memory().percent
    print(f"CPU Usage: {cpu_usage}%")
    print(f"RAM Usage: {ram_usage}%")

    # Sauvegarde dans un fichier pour analyse offline
    #timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    #output_file = f"results_{timestamp}.csv"

 
    print("\nRésumé des performances :")
    print(f" - Total batches traités : {total_batches}")
    print(f" - Temps moyen par batch : {average_batch_time:.4f} sec")
    print(f" - Prédictions totales : {len(all_preds)}")
    
    
   

if __name__ == "__main__":
    main()