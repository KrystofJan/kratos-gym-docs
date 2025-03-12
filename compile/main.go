package main

import (
    "bufio"
    "fmt"
    "os/exec"
    "path/filepath"
)

func runCmd(c chan string, ex chan error, command string, args ...string) {
    cmd := exec.Command(command, args...)

    // Get the command's standard output
    stdout, err := cmd.StdoutPipe()
    if err != nil {
	ex <- fmt.Errorf("Error creating StdoutPipe:", err)
	return
    }

    // Start the command
    if err := cmd.Start(); err != nil {
	ex <- fmt.Errorf("Error starting command:", err)
	return
    }

    // Read output line by line
    scanner := bufio.NewScanner(stdout)
    for scanner.Scan() {
	c <- scanner.Text()
    }

    // Check for errors in scanning
    if err := scanner.Err(); err != nil {
	ex <- fmt.Errorf("Error reading output:", err)
	return
    }

    // Wait for the command to complete
    if err := cmd.Wait(); err != nil {
	ex <- fmt.Errorf("Command finished with error:", err)
	return
    }
}

func main() {
    compile, _ := make(chan string), make(chan string)
    compileEnd, _:= make(chan error), make(chan error)


    texPath, _ := filepath.Abs("../BachelorThesis.tex")
    outputPath, _ := filepath.Abs("../output")
    // TODO: WORK OUT ROUTING
    go runCmd(compile, compileEnd, "latexmk", "-pdf", "-pvc", "-output-directory=" + outputPath, texPath )
    // go runCmd(listen, listenEnd, "zathura", "../output/BachelorsThesis.pdf")
    for {
	select {
	    case cmpl := <-compile:
		fmt.Println("[COMPILER] - ", cmpl)
	 //    case zath := <-listen:
		// fmt.Println("[ZATHURA] - ", zath)	
	    case cmplErr := <-compileEnd:
		fmt.Println("[ERROR] [COMPILER] - ", cmplErr)
	    // case zathErr := <-listenEnd:
	    //     fmt.Println("[ERROR] [ZATHURA] - ", zathErr)	
	    }
    }
}
