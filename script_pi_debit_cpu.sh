#!/bin/bash

PC_IP="192.168.42.2"
VIDEO_NAMES=("video1" "video2" "video3","video4")
VIDEO_DURATION=300   # en secondes
INTERFACE="any"      # eth0 ou any
NB_VIDEOS = 4
echo "Capture CPU et débit pour toutes les vidéos"

#tcpdump unique pour toutes les vidéos en fond
#sudo tcpdump -i any host $PC_IP and tcp port 443 -w "all_videos.pcap" &
#TCPDUMP_PID=$!
tcpdump -i any '((src host 192.168.42.2 and dst host 142.250.201.46) or (src host 142.250.201.46 and dst host 192.168.42.2) or (src host 192.168.42.2 and dst host 142.250.201.4) or (src host 142.250.201.4 and dst host 192.168.42.2) or (src host 192.168.42.2 and dst host 192.168.42.1) or (src host 192.168.42.1 and dst host 192.168.42.2) ) and tcp port 443' -w capturepacket.pcap &
TCPDUMP_PID=$!


#Mesure CPU et debit pour toutes les videos en fond
python3 - <<EOF &
import psutil, time, csv

VIDEO_NAMES = ${VIDEO_NAMES[@]}
VIDEO_DURATION = $VIDEO_DURATION
INTERFACE = "$INTERFACE"

with open("cpu_net.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["timestamp","video","cpu_percent","#video"])

    start_time = time.time()
    video_idx = 0

    while video_idx < len(VIDEO_NAMES):
        video_start = time.time()
        while time.time() - video_start < VIDEO_DURATION:
            now = time.time()
            cpu = psutil.cpu_percent(interval=1)

            writer.writerow([now, VIDEO_NAMES[video_idx], cpu,NB_VIDEOS])
        video_idx += 1
EOF
