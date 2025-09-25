#FROM balenalib/raspberrypi3-debian:bullseye-run

# Installer les paquets nécessaires
#RUN apt-get update && apt-get -y install hostapd dnsmasq iproute2 ifupdown iptables wireless-tools network-manager && rm -rf /var/lib/apt/lists/*

# Copier la configuration
#COPY hostapd.conf /etc/hostapd/hostapd.conf
#COPY dnsmasq.conf /etc/dnsmasq.conf
#COPY wifi.sh /usr/src/wifi.sh
#COPY monitor.sh /usr/src/monitor.sh

#RUN chmod +x /usr/src/wifi.sh /usr/src/monitor.sh

#CMD ["/usr/src/wifi.sh"]
#FROM balenalib/%%BALENA_MACHINE_NAME%%-python:3.9-slim

# Image de base Python 3.9 pour Raspberry Pi 3
FROM balenalib/raspberrypi3-python:3.9-bullseye-build

# Installer dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
        gfortran \
        libopenblas-dev \
        liblapack-dev \
        libatlas-base-dev \
    && rm -rf /var/lib/apt/lists/*

# Mettre à jour pip/wheel/setuptools
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Installer les librairies Python
RUN pip install --no-cache-dir pandas scikit-learn psutil joblib numpy


WORKDIR /tr-app

COPY random_forest_model.pkl /tr-app/random_forest_model.pkl

COPY log_metrics_stats.sh /tr-app/log_metrics_stats.sh

COPY log_python_metrics.sh /tr-app/log_python_metrics.sh

RUN chmod +x /tr-app/log_metrics_stats.sh
RUN chmod +x /tr-app/log_python_metrics.sh

ADD predict_rf.py  /tr-app/predict_rf.py
ADD  Data/TEST_0.0.100000.csv.xz /tr-app/TEST_0.0.100k.csv.xz
CMD ["python3", "predict_rf.py"]