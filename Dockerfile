FROM golang:bookworm AS builder

# Install libpcap
RUN apt-get update && \
    apt-get -y install libpcap0.8 libpcap0.8-dev
# Set the working directory to ...
WORKDIR /go/src/github.com/ENSL-NS/tr-ap/

# Copy the source code and config files
ADD cmd ./cmd/
ADD internal ./internal/
ADD scripts ./scripts/
ADD Makefile ./
ADD go.* ./

# Get dependencies
RUN go mod tidy

RUN go run scripts/create_counters.go

# Build TR
RUN make


FROM debian:bookworm

# Install libpcap
RUN apt-get update && \
  apt-get -y install libpcap0.8 libpcap0.8-dev

# Install tcpreplay
RUN apt-get update && \
  apt-get -y install tcpreplay tcpdump wget lsb-release gnupg vim nano  
  


WORKDIR /root/
COPY --from=builder /go/src/github.com/ENSL-NS/tr-ap/tr /usr/bin/

# Copy configuration files
ADD ./configs config/
ADD ./test  test/
# Copy script files
ADD ./scripts/run_replay.sh scripts/

# Copy container performance stats from capture script
#COPY log_metrics_stats.sh /scripts/
#COPY script_pi_debit_cpu.sh /scripts/
#COPY first.py /scripts/
#RUN chmod +x /scripts/log_metrics_stats.sh
#RUN chmod +x /scripts/script_pi_debit_cpu.sh

# Add folder to drop output.
VOLUME /data

ENTRYPOINT ["/usr/bin/tr"]
CMD ["-c", "/root/config/trconfig_default.json", "-out", "/out/"]
