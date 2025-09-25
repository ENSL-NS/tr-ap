#Voilà un script Python unique qui :

#démarre tcpdump en arrière-plan pour capturer le trafic PC ↔ Pi ↔ Internet,

#mesure CPU (%) et débit (Tx/Rx sur eth0+eth1) avec psutil,

#logge tout ça dans un CSV avec le nombre de vidéos en cours,

#arrête tcpdump proprement à la fin.

import psutil
import time
import csv
import subprocess
import signal
import os

#  Paramètres
PC_IP = "192.168.42.2"
PI_IP = "192.168.42.1"
YOUTUBE_IPS = ["142.250.201.4", "142.250.201.46"]  # à adapter selon DNS résolu
INTERFACES = ["eth0", "eth1"]  # les interfaces à monitorer
CSV_FILE = "metrics.csv"
DURATION = 300   # durée en secondes (5 min)
NB_VIDEOS = 3    # nombre de vidéos lancées via Selenium

# Lancer tcpdump
tcpdump_filter = f"((src host {PC_IP} and dst host {PI_IP}) or (src host {PI_IP} and dst host {PC_IP})"
for ip in YOUTUBE_IPS:
    tcpdump_filter += f" or (src host {PC_IP} and dst host {ip}) or (src host {ip} and dst host {PC_IP})"
tcpdump_filter += ") and tcp port 443"

tcpdump_cmd = [
    "tcpdump", "-i", "any", "-nn", "-w", "capture.pcap", tcpdump_filter
]

tcpdump_proc = subprocess.Popen(tcpdump_cmd, preexec_fn=os.setsid)
print(f"tcpdump lancé (PID={tcpdump_proc.pid})")

# Init CSV
with open(CSV_FILE, mode="w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["time", "cpu_percent", "bytes_sent_kBps", "bytes_recv_kBps", "nb_videos"])

prev_net = psutil.net_io_counters(pernic=True)
time.sleep(1)  # première mesure d’écart

# Boucle de mesure
for t in range(DURATION):
    cpu = psutil.cpu_percent(interval=1)

    net = psutil.net_io_counters(pernic=True)
    bytes_sent = 0
    bytes_recv = 0
    for iface in INTERFACES:
        if iface in net and iface in prev_net:
            bytes_sent += net[iface].bytes_sent - prev_net[iface].bytes_sent
            bytes_recv += net[iface].bytes_recv - prev_net[iface].bytes_recv

    # sauvegarde CSV
    with open(CSV_FILE, mode="a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([t, cpu, bytes_sent/1024, bytes_recv/1024, NB_VIDEOS])

    prev_net = net

print("Fin de capture.")

# Stop tcpdump
os.killpg(os.getpgid(tcpdump_proc.pid), signal.SIGTERM)
print("tcpdump arrêté.")
