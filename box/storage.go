package main

import (
	"machine"
	"time"
)

// TODO: Switch to https://github.com/tinygo-org/tinyfs/blob/release/examples/console/littlefs/machine/main.go
// TODO: Use https://github.com/tinygo-org/tinyfs/blob/release/examples/console/example.go#L378 for help

const (
	flashBlockSize = 4096 // Set a reasonable block size based on your flash memory
)

// This prints a fuckton of info about storage to terminal or wherever the fuck println goes
func storageInfo() {
	println("INFO:   Flash data start:       ", machine.FlashDataStart())
	println("INFO:   Flash data end:         ", machine.FlashDataEnd())
	println("INFO:   Flash data size, bytes: ", machine.Flash.Size())
	println("INFO:   Flash write block size: ", machine.Flash.WriteBlockSize())
	println("INFO:   Flash erase block size: ", machine.Flash.EraseBlockSize())
	println()

}

// Read and return all of what is currently stored onboard.
func readAllStorage() string {
	println("FLSH:   Reading all contents of onboard flash storage...")
	// Determine the size of the flash memory
	println("FLSH:   >Determining flash size...")
	flashSize := machine.Flash.Size()

	// Read flash contents into a byte slice of the appropriate size
	println("FLSH:   >>Reading flash contents...")

	// used chatgpt, I hope this shit works
	readData := make([]byte, 0) // Initialize an empty byte slice
	for offset := int64(0); offset < flashSize; offset += flashBlockSize {
		// Read a chunk of data
		chunkSize := min(flashBlockSize, flashSize-offset)
		chunk := make([]byte, chunkSize)
		err := reFl(chunk, offset)
		if err != nil {
			checkErrorStorage(err)
			break
		}
		// Append the chunk to the readData slice
		readData = append(readData, chunk...)
	}
	println(readData) // TODO: DEBUG
	err := reFl(readData, 0)
	print(err)
	println("FLSH:   >>>Verifying storage integrity...")
	checkErrorStorage(err)
	println("FLSH:   Done!")
	println("FLSH:   Returning string... Done!")
	return string(readData)
}

func writeAllStorage(stringToWrite string) {
	// this writes over all storage
	// remove all stored data
	println("FLSH:   Overwriting all contents of onboard flash...")
	println("FLSH:   >>Erasing...")
	err := eraseAllBlocks() // erase all blocks
	println("FLSH:   >>>Verifying storage integrity...")
	checkErrorStorage(err)
	// Write data to flash memory
	println("FLSH:   >>>>Writing...")
	err = wrFl([]byte(stringToWrite), 0)
	println("FLSH:   >>>>>Verifying storage integrity...")
	checkErrorStorage(err)
	println("FLSH:   Done!")
}

func eraseAllBlocks() error {
	println("FLSH:   Deleting all contents of onboard flash storage...")
	println("FLSH:   >Erasing selected blocks(" + ")...")
	err := machine.Flash.EraseBlocks(0, machine.Flash.Size()/machine.Flash.EraseBlockSize()) // erase all blocks
	println("FLSH:   Done!")
	println("FLSH:   Returning error variable... Done!")
	return err
}

// Check for errors after reading/writing flash memory
func checkErrorStorage(err error) {
	if err != nil {
		for {
			println("CHSE:   " + err.Error())
			time.Sleep(time.Second)
		}
	}
}

// Read from flash memory
func reFl(data []byte, offset int64) error {
	_, err := machine.Flash.ReadAt(data, offset)
	return err
}

// Write to flash memory
func wrFl(data []byte, offset int64) error {
	_, err := machine.Flash.WriteAt(data, offset)
	return err
}

// Check if two byte slices are equal
func storageEqual(a, b []byte) bool {
	if len(a) != len(b) {
		return false
	}
	for i, v := range a {
		if v != b[i] {
			return false
		}
	}
	return true
}
