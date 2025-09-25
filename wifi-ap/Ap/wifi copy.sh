#!/bin/bash
set -e

echo "[INFO] Configuration et démarrage du point d'accès..."

echo " [INFO] Configuration de l'interface WLAN ==="
# Dire à NetworkManager de ne pas gérer wlan0
#nmcli dev set wlan0 managed no || true

# Configurer une IP statique pour wlan0

ip link set wlan0 down
ip addr flush dev wlan0
ip addr add 192.168.4.1/24 dev wlan0
ip link set wlan0 up

echo " [INFO] Configuration de l'interface WLAN finish ==="
# === 4. Activer l'IP forwarding pour router entre wlan0 et eth0 ===
echo 1 > /proc/sys/net/ipv4/ip_forward

# Rendre la modification persistante dans le conteneur
if ! grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf; then
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
fi

echo " [INFO] Activer l'IP forwarding pour router entre wlan0 et eth0 finish ==="
# === 5. Configuration de la Mascarade & du Firewall ===
# Vider les règles existantes
iptables -F
iptables -t nat -F

# Politique par défaut
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# Activer le NAT pour permettre aux clients WiFi d'accéder à Internet via eth0
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
echo " [INFO] Activer le NAT pour permettre aux clients WiFi d'accéder à Internet via eth0 finish ==="
# Optionnel : autoriser le trafic entrant sur wlan0
iptables -A INPUT -i wlan0 -j ACCEPT
iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT

echo " [INFO] autoriser le trafic entrant sur wlan0 finish ==="
# === 6. Lancer les services ===
# Lancer dnsmasq en arrière-plan
dnsmasq --conf-file=/etc/dnsmasq.conf &
echo " [INFO] Lancer dnsmasq en arrière-plan finish ==="
# Lancer hostapd en mode debug (premier plan)
exec hostapd hostapd.conf -d
echo " [INFO]  Lancer hostapd en mode debug (premier plan) finish ==="
# Lancer le script de monitoring en arrière-plan
bash /usr/src/monitor.sh &
wait -n