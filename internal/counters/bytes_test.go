package counters

import (
	"testing"

	"github.com/ENSL-NS/tr-ap/internal/network"
	"github.com/ENSL-NS/tr-ap/internal/utils"
)

func TestAddPacketBytesCopyCounters(t *testing.T) {
	trace := network.GetTrace(utils.GetRepoPath() + "/test/traffic_data/short_test.pcap")
	c := &ByteCopyCounters{}
	c.Reset()
	for _, pkt := range trace.Trace {
		c.AddPacket(&pkt.Pkt)
	}
	if c.CopiedBytes != 400 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.CopiedBytes, 400)
	} else if c.StoredBytes != 400 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.StoredBytes, 400)
	}
}

func TestClearBytesCopyCounters(t *testing.T) {
	trace := network.GetTrace(utils.GetRepoPath() + "/test/traffic_data/short_test.pcap")
	c := &ByteCopyCounters{}
	c.Reset()
	for _, pkt := range trace.Trace {
		c.AddPacket(&pkt.Pkt)
	}
	c.Clear()
	if c.CopiedBytes != 400 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.CopiedBytes, 400)
	} else if c.StoredBytes != 0 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.StoredBytes, 0)
	}
}

func TestResetBytesCopyCounters(t *testing.T) {
	trace := network.GetTrace(utils.GetRepoPath() + "/test/traffic_data/short_test.pcap")
	c := &ByteCopyCounters{}
	c.Reset()
	for _, pkt := range trace.Trace {
		c.AddPacket(&pkt.Pkt)
	}
	c.Reset()
	if c.CopiedBytes != 0 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.CopiedBytes, 0)
	} else if c.StoredBytes != 0 {
		t.Fatalf("Number of copied bytes %d does not correspond to expected one %d", c.StoredBytes, 0)
	}
}

func TestCollectBytesCopyCounters(t *testing.T) {
	trace := network.GetTrace(utils.GetRepoPath() + "/test/traffic_data/short_test.pcap")
	c := &ByteCopyCounters{}
	c.Reset()
	for _, pkt := range trace.Trace {
		c.AddPacket(&pkt.Pkt)
	}
	t.Logf("Counter representation: %s", c.Collect())
}
