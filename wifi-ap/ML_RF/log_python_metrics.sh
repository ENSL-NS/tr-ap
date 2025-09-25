#!/bin/bash

LOGFILE="metrics_log.csv"
INTERVAL=0.1  # 100 ms

if [ $# -eq 0 ]; then
  echo "Usage: $0 \"commande_python_avec_parametres\""
  exit 1
fi

# Lire la RAM totale (en Ko) depuis /proc/meminfo
TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')

# Lancer le script Python
$@ &
PID=$!

echo ">>> Script lancé (PID=$PID)"
# En-tête du CSV
echo "timestamp,cpu_percent,mem_percent,rss_kb,rss_percent" > "$LOGFILE"

while kill -0 $PID 2>/dev/null; do
    STATS=$(ps -p $PID -o %cpu,%mem,rss --no-headers 2>/dev/null)
    CPU=$(echo $STATS | awk '{print $1}')
    MEM=$(echo $STATS | awk '{print $2}')
    RSS=$(echo $STATS | awk '{print $3}')  # en Ko
    RSS_PERCENT=$(awk -v rss="$RSS" -v total="$TOTAL_RAM_KB" 'BEGIN {printf "%.2f", (rss/total)*100}')

    TS=$(date +"%Y-%m-%d_%H:%M:%S.%6N")
    echo "$TS,$CPU,$MEM,$RSS,$RSS_PERCENT" >> "$LOGFILE"

    #sleep $INTERVAL
done

echo ">>> Processus terminé (PID=$PID). Logs enregistrés dans $LOGFILE"

echo "Fin de la surveillance."