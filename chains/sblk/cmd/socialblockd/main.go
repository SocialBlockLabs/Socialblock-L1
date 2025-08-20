package main
import (
	"fmt"
	"os"
	"github.com/spf13/cobra"
)
func main(){root:=&cobra.Command{Use:"socialblockd",Short:"SocialBlock node (skeleton)",Run:func(cmd *cobra.Command,args []string){fmt.Println("SocialBlockd skeleton binary.")}}; if err:=root.Execute(); err!=nil{os.Exit(1)}}
