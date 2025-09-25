#!/bin/bash

# Vérification des arguments
if [ -z "$1" ]; then
    echo "Usage: $0 <id_du_conteneur>"
    exit 1
fi

CONTAINER_ID="$1"
OUTPUT_FILE="balena_stats_${CONTAINER_ID}_$(date '+%Y%m%d_%H%M%S').csv"

# En-tête CSV
echo "timestamp,container_id,name,cpu %,mem usage,mem %,net input,net output,block input,block output,pids" > "$OUTPUT_FILE"

# Boucle infinie pour collecter les stats
while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    # Obtenir une ligne de stats
    STATS=$(balena stats "$CONTAINER_ID" --no-stream --format "{{.Container}},{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}},{{.BlockIO}},{{.PIDs}}")

    # Vérifie si la commande a échoué (par exemple, conteneur inexistant)
    if [ $? -ne 0 ]; then
        echo "$TIMESTAMP,ERROR: Unable to get stats for container $CONTAINER_ID" >> "$OUTPUT_FILE"
    else
        # Nettoyage et mise en forme CSV
        # Exemple de STATS :
        # b8b8c3dbf0d7,webserver,0.12%,15.6MiB / 512MiB,3.05%,1.2kB / 0B,0B / 0B,5
        # => Ajoute TIMESTAMP devant
        echo "$TIMESTAMP,$STATS" >> "$OUTPUT_FILE"
    fi

    sleep 2  # Pause entre les mesures (modifiable)
done