#!/bin/bash
while true; do
  sleep 30
  if ! pgrep hostapd >/dev/null; then
    echo "[MONITOR] hostapd est tombé, redémarrage..."
    hostapd /etc/hostapd/hostapd.conf -B
  fi
  if ! pgrep dnsmasq >/dev/null; then
    echo "[MONITOR] dnsmasq est tombé, redémarrage..."
    dnsmasq --conf-file=/etc/dnsmasq.conf
  fi
done