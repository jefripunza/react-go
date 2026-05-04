package modules

import "react-go/core/worker"

func SetupWorkers() {
	// Start worker manager
	worker.Example{}.Start()
}
