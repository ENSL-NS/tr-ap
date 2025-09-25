# pc_net_logger.py
import psutil
import time
import csv
import subprocess

iface = "eno2"   # interface réseau du PC

def get_throughput(prev,prev_time):
        curr = psutil.net_io_counters(pernic=True)[iface]
        tx_bytes = curr.bytes_sent - prev.bytes_sent
        rx_bytes = curr.bytes_recv - prev.bytes_recv
        total_bytes = (curr.bytes_sent - prev.bytes_sent) + (curr.bytes_recv - prev.bytes_recv)
        elapsed = time.time() - prev_time

        tx_kbps = (tx_bytes * 8) / 1000 / elapsed
        rx_kbps = (rx_bytes * 8) / 1000 / elapsed
        throughput_kbps = (total_bytes * 8) / 1000 / elapsed
        
        return throughput_kbps, tx_kbps,rx_kbps, curr
    
    
def get_tcp_stats():
    try:
        cmd = [
            "tshark", "-i", iface, "-q",
            "-z", "io,stat,1,tcp ,tcp.analysis.retransmission,tcp.analysis.lost_segment",
            "-f", "tcp port 443"
        ]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
        #out = subprocess.check_output(cmd, stderr=subprocess.DEVNULL).decode()

        total_tcp = 0
        retrans = 0
        lost = 0

        for line in proc.stdout:
            line = line.strip()
            # Ligne tcp.total (total TCP frames)
            if line.startswith("tcp"):
                parts = line.split()
                if len(parts) >= 3:
                    # Frames
                    total_tcp += int(parts[1])
                    # Bytes perdus si tshark le fournit
            # Ligne retransmissions
            if "tcp.analysis.retransmission" in line:
                try:
                    retrans += int(line.split()[-1])
                except:
                    pass
            # Ligne lost segment
            if "tcp.analysis.lost_segment" in line:
                try:
                    lost += int(line.split()[-1])
                except:
                    pass

        loss_percent = (lost / total_tcp * 100) if total_tcp > 0 else 0
        return retrans, loss_percent

    except Exception as e:
        print("Erreur Tshark:", e)
        return 0, 0
with open("pc_net.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["timestamp", "tx_kbps", "rx_kbps", "throughput_kbps"])

    prev = psutil.net_io_counters(pernic=True)[iface]
    prev_time = time.time()

    while True:
        time.sleep(1)
        now = time.time()
        throughput_kbps,tx_kbps,rx_kbps, prev = get_throughput(prev,prev_time)
        #retrans, loss_percent = get_tcp_stats()

        

        writer.writerow([time.time(), f"{tx_kbps:.2f}", f"{rx_kbps:.2f}",f"{throughput_kbps:.2f}"])
        f.flush()
        #print(f"{iface} → Tx: {tx_kbps:.2f} kbps | Rx: {rx_kbps:.2f} kbps | Throughput: {throughput_kbps:.2f} kbps | Retrans={retrans} | Loss={loss_percent:.2f}%") 
        print(f"{iface} → Tx: {tx_kbps:.2f} kbps | Rx: {rx_kbps:.2f} kbps | Throughput: {throughput_kbps:.2f} kbps")
