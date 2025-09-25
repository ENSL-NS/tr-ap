# pc_net_logger.py
import psutil
import time
import csv
import subprocess

iface = "eno2"   # interface réseau du PC
duration = 302                  # Capture duration in seconds
output_txt = "tshark_raw.txt"  # Raw tshark output
output_csv = "stats.csv"       # Final CSV file
interval_sec = 1               # Interval in seconds
filter_expr = "tcp,tcp.analysis.lost_segment,tcp.analysis.retransmission"

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
        "timeout", str(duration),
        "tshark",
        "-i", iface,
        "-q",
        "-z", f"io,stat,{interval_sec},{filter_expr}"
         ]
        with open(output_txt, "w") as f:
            subprocess.run(cmd, stdout=f)
        #out = subprocess.check_output(cmd, stderr=subprocess.DEVNULL).decode()

        total_tcp = 0
        retrans = 0
        lost = 0
        rows = []
        with open(output_txt, "r") as f:
          for line in f:
                if "<>" in line:
                    clean_line = re.sub(r"[|]", "", line).strip()
                    tokens = re.split(r"\s+", clean_line)
                    if len(tokens) < 8:
                        continue  # skip incomplete lines

                    interval = f"{tokens[0]}-{tokens[2]}"

            # Extract frames and bytes by positions from the end
                    retrans_bytes = tokens[-1]
                    retrans_frames = tokens[-2]
                    lost_bytes = tokens[-3]
                    lost_frames = tokens[-4]
                    total_bytes = tokens[-7]
                    total_frames = tokens[-8]

            # Compute throughput and loss %
                    throughput = int(total_bytes) / interval_sec
                    loss_percent = ((int(lost_frames) + int(retrans_frames)) / int(total_frames) * 100) if int(total_frames) > 0 else 0
                    loss_percent2 = (int(lost_frames) / int(total_frames) * 100) if int(total_frames) > 0 else 0


                    rows.append([interval, total_frames, lost_frames, lost_bytes, retrans_frames, retrans_bytes, throughput, loss_percent, loss_percent2])

                    loss_percent = (lost / total_tcp * 100) if total_tcp > 0 else 0
                    return retrans, loss_percent

    except Exception as e:
        print("Erreur Tshark:", e)
        return 0, 0
