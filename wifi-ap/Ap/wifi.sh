#!/bin/bash
set -e

echo "[INFO] Configuration et démarrage du point d'accès..."
INTERFACE_WIFI="wlan0"
INTERFACE_INTERNET="eth0"
SSID="RaspiHospot"
PASSWORD="MonMotDePasse123"
echo "[INFO] Nettoyage des éventuelles configurations précédentes..."
nmcli device disconnect $INTERFACE_WIFI

function setup_interface_wifi() {
    echo "[INFO] Configuration IP statique pour $INTERFACE_WIFI"
    ip addr flush dev $INTERFACE_WIFI
    ip addr add 192.168.4.1/24 dev $INTERFACE_WIFI
    ip link set $INTERFACE_WIFI up
}

#function clean_iptables() {
  #  echo "[INFO] Nettoyage des règles iptables existantes..."

    # Supprimer les règles spécifiques au hotspot si elles existent
   # iptables -t nat -D POSTROUTING -o $INTERFACE_INTERNET -j MASQUERADE 2>/dev/null
   # iptables -D INPUT -i $INTERFACE_WIFI -j ACCEPT 2>/dev/null
    #iptables -D FORWARD -i $INTERFACE_INTERNET -o $INTERFACE_WIFI -m state --state RELATED,ESTABLISHED -j ACCEPT 2>/dev/null
    #iptables -D FORWARD -i $INTERFACE_WIFI -o $INTERFACE_INTERNET -j ACCEPT 2>/dev/null
#}

function setup_iptables() {
    echo "[INFO] Configuration des règles iptables..."

    iptables -w -F
    iptables -w -t nat -F
    iptables -w -P INPUT ACCEPT
    iptables -w -P FORWARD ACCEPT
    iptables -w -P OUTPUT ACCEPT
    iptables -w -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    iptables -w -A INPUT -i wlan0 -j ACCEPT
    iptables -w -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -w -A FORWARD -i wlan0 -o eth0 -j ACCEPT

}

function start_hotspot() {
    echo "[INFO] Démarrage du hotspot avec nmcli..."
    nmcli device wifi hotspot ifname $INTERFACE_WIFI ssid $SSID password ""
}

function enable_ip_forwarding() {
    echo "[INFO] Activation de l'IP forwarding..."
    echo 1 > /proc/sys/net/ipv4/ip_forward

  # Rendre la modification persistante dans le conteneur
    if ! grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf; then
     	echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf	
    fi
}

#clean_iptables

echo " [INFO] Configuration de l'interface WLAN ==="
#setup_interface_wifi
start_hotspot

echo " [INFO] Configuration de l'interface WLAN finish ==="
# === 4. Activer l'IP forwarding pour router entre wlan0 et eth0 ===
enable_ip_forwarding

echo " [INFO] Activer l'IP forwarding pour router entre wlan0 et eth0 finish ==="
# === 5. Configuration de la Mascarade & du Firewall ===
setup_iptables
echo " [INFO] autoriser le trafic entrant sur wlan0 finish ==="