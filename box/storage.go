package main

import (
	"machine"
	"time"
)

// This prints a fuckton of info about storage to terminal or wherever the fuck println goes
func storageInfo() {
	println("Flash data start:       ", machine.FlashDataStart())
	println("Flash data end:         ", machine.FlashDataEnd())
	println("Flash data size, bytes: ", machine.Flash.Size())
	println("Flash write block size: ", machine.Flash.WriteBlockSize())
	println("Flash erase block size: ", machine.Flash.EraseBlockSize())
	println()

}

// Read and return all of what is currently stored onboard.
func readAllStorage() string {
	println("Reading all contents of onboard flash storage...")
	// Determine the size of the flash memory
	println(">Determining flash size...")
	flashSize := machine.Flash.Size()

	// Read flash contents into a byte slice of the appropriate size
	println(">>Reading flash contents...")
	readData := make([]byte, flashSize)
	err := reFl(readData, 0)
	println(">>>Verifying storage integrity...")
	checkErrorStorage(err)
	println("Done!")
	println("Returning string... Done!")
	return string(readData)
}

func writeAllStorage(stringToWrite string) {
	// this writes over all storage
	// remove all stored data
	println("Overwriting all contents of onboard flash storage...")
	println(">Erasing...")
	err := eraseAllBlocks() // erase all blocks
	println(">>>Verifying storage integrity!")
	checkErrorStorage(err)
	// Write data to flash memory
	println(">>Writing...")
	err = wrFl([]byte(stringToWrite), 0)
	println(">>>Verifying storage integrity!")
	checkErrorStorage(err)
	println("Done!")
}

func eraseAllBlocks() error {
	println("Deleting all contents of onboard flash storage...")
	println(">Erasing selected blocks(" + ")...")
	err := machine.Flash.EraseBlocks(0, machine.Flash.Size()/machine.Flash.EraseBlockSize()) // erase all blocks
	println("Done!")
	println("Returning error variable... Done!")
	return err
}

// Check for errors after reading/writing flash memory
func checkErrorStorage(err error) {
	if err != nil {
		for {
			println(err.Error())
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
