#!/bin/bash

get_container_id() {
    ID=$(awk -F'/' '/docker|balena/ {print $NF}' /proc/self/cgroup | head -n 1)
    if [ -z "$ID" ]; then
        ID=$(hostname)
    fi
    echo "$ID"
}

echo "[INFO] Script metrics lancé à $(date)" >> metrics_debug.log


CONTAINER_ID=$(balena ps --no-trunc -q --filter name="Ml_ap")
CONTAINER_NAME=Ml_ap
DATE_o=$(TZ="Europe/Paris" date '+%Y%m%d_%H%M%S')

OUTPUT="cgroup_metrics_${CONTAINER_ID}_${DATE_o}.csv"
INTERFACE="eth0"  # À adapter selon l'interface réseau de ton conteneur

# Entête du CSV
echo "timestamp,container_id,cpu_usage_ns,cpu_pct,cpu_pct_core,mem_usage_bytes,mem_limit_bytes,mem_pct,mem_max,rss,rss_pct" > "$OUTPUT"

prev_cpu=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpuacct.usage)
prev_time=$(date +%s%N)
NUM_CPU=$(nproc)

while true; do

     # Vérifier si le conteneur tourne encore
    #if ! balena inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null | grep -q true; then
        #echo "[INFO] Conteneur $CONTAINER_NAME arrêté, arrêt du logger."
        #break
    #fi

    #TIMESTAMP=$(TZ="Europe/Paris" date '+%Y-%m-%d_%H:%M:%S.%f')
    TIMESTAMP=$(TZ="Europe/Paris" date '+%Y-%m-%d_%H:%M:%S').$(date '+%N' | cut -c1-6)

    # CPU usage (nanoseconds)
    if [ -f /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpuacct.usage ]; then
        CPU_USAGE=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpuacct.usage)
    else
        CPU_USAGE=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/$docker-${CONTAINER_ID}.scope/cpuacct.usage 2>/dev/null)
    fi

    # Quota CPU configuré
    if [ -f /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_quota_us ]; then
        CPU_QUOTA=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_quota_us)
    else
        CPU_QUOTA=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_quota_us 2>/dev/null)
    fi
    
    # Période de quota
    if [ -f /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_period_us ]; then
        CPU_per_QUOTA=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_period_us)
    else
        CPU_per_QUOTA=$(cat /sys/fs/cgroup/cpu,cpuacct/system.slice/docker-${CONTAINER_ID}.scope/cpu.cfs_period_us 2>/dev/null)
    fi

    #if  [ "$CPU_USAGE" -eq 0 ]; then
       #echo "[INFO] Inference terminée dans le conteneur $CONTAINER_NAME, arrêt du logger."
       #break
    #fi

    # CPU %
    curr_time=$(date +%s%N)
    delta_cpu=$((CPU_USAGE - prev_cpu))
    delta_time=$((curr_time - prev_time))
    if [ "$delta_time" -ne 0 ]; then
    # %cpu par core
        CPU_PCT_core=$(awk -v dc="$delta_cpu" -v dt="$delta_time" -v nc="$NUM_CPU" 'BEGIN {printf "%.2f", (dc/dt)*100 / nc}')
    # %cpu global sur tous les cores
        CPU_PCT=$(awk -v dc="$delta_cpu" -v dt="$delta_time" 'BEGIN {printf "%.2f", (dc/dt)*100 }')

    else
        CPU_PCT=0.00
        CPU_PCT_core=0.00
    fi
    # CPU_PCT=$(awk "BEGIN {printf \"%.2f\", ($delta_cpu/$delta_time)*100}")
    prev_cpu=$CPU_USAGE
    prev_time=$curr_time

    if [ -f /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.usage_in_bytes ]; then
    MEM_USED=$(cat /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.usage_in_bytes)
    else
        MEM_USED=0
    fi

    # Lecture de la limite mémoire
    if [ -f /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.limit_in_bytes ]; then
        MEM_LIMIT=$(cat /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.limit_in_bytes)
    else
        MEM_LIMIT=0
    fi

    # Gestion des limites absurdes (comme Balena/Docker)
    LARGE_LIMIT_THRESHOLD=1152921504606846976  # 2^60

    if [ "$MEM_LIMIT" -ge "$LARGE_LIMIT_THRESHOLD" ] || [ "$MEM_LIMIT" -eq 0 ]; then
        # Cas illimité : on récupère la RAM physique
        MEM_TOTAL_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
        MEM_LIMIT=$((MEM_TOTAL_KB * 1024))  # Conversion en bytes
    fi

    # Lecture des stats détaillées (RSS et Cache)
    if [ -f /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.stat ]; then
        MEM_STAT_FILE=/sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.stat
    else
        MEM_STAT_FILE=""
    fi

    if [ -n "$MEM_STAT_FILE" ]; then
        TOTAL_RSS=$(grep total_rss "$MEM_STAT_FILE" | awk '{print $2}')
        TOTAL_CACHE=$(grep total_cache "$MEM_STAT_FILE" | awk '{print $2}')
    else
        TOTAL_RSS=0
        TOTAL_CACHE=0
    fi

    # Calcul du pourcentage total
    MEM_PCT=$(awk -v mem_used="$MEM_USED" -v mem_limit="$MEM_LIMIT" 'BEGIN {printf "%.2f", (mem_used/mem_limit)*100}')
    RSS_PCT=$(awk -v rss="$TOTAL_RSS" -v mem_limit="$MEM_LIMIT" 'BEGIN {printf "%.2f", (rss/mem_limit)*100}')

    MEM_MAX=$(cat /sys/fs/cgroup/memory/system.slice/docker-${CONTAINER_ID}.scope/memory.max_usage_in_bytes)

    echo "Cpu utilisée totale : $CPU_USAGE"
    echo "Utilisation cpu : $CPU_PCT %"
    echo "Mémoire utilisée totale : $MEM_USED bytes"
    echo "Limite mémoire          : $MEM_LIMIT bytes"
    echo "Utilisation mémoire     : $MEM_PCT %"
    echo "RSS (Real Used Memory)  : $TOTAL_RSS bytes"
    echo "Cache                   : $TOTAL_CACHE bytes"
    echo "Utilisation RSS         : $RSS_PCT %"

    echo "$TIMESTAMP,$CONTAINER_ID,$CPU_USAGE,$CPU_PCT,$CPU_PCT_core,$MEM_USED,$MEM_LIMIT,$MEM_PCT,$MEM_MAX,$TOTAL_RSS,$RSS_PCT" >> "$OUTPUT"

    sleep 0.1
done
echo "[INFO] Script metrics pris fin  à $(date)" >> metrics_debug.log