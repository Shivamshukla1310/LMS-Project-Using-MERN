import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"

const Login = () => {
  const [signupInput, setSignupInput] = useState({name:"", email:"",password:""});
  const [loginInput, setLoginInput] = useState({name:"", email:"",password:""});
  const changeInputHandler = (e, type) => {
    const {name, value} = e.target;
    if(type === "signup"){
      setSignupInput({...signupInput, [name]:value});
    }else{
      setLoginInput({...loginInput, [name]: value});
    }
  }

  const handleRegistration = (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    console.log(inputData);
  }
  return (
    <div className="flex items-center justify-center w-full">
      <Tabs  className = "w-[400px]" defaultValue="signup">
        <TabsList className= "grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Login your password here and you'll get logged in
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="signup-name">Name</Label>
                <Input 
                type="text" 
                name = "name"
                value = {signupInput.name}
                onChange={(e) => changeInputHandler(e, "signup")} 
                placeholder = "Eg. Shukla Ji" 
                required="true" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                type="email" 
                name = "email"
                value = {signupInput.email}
                onChange={(e) => changeInputHandler(e, "signup")}  
                placeholder = "Eg. Shukla Ji@gmail.com" 
                required="true" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                type="password" 
                name = "password"
                value = {signupInput.password}
                onChange={(e) => changeInputHandler(e, "signup")}  
                placeholder = "Eg. Shukla_ji#542"
                required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleRegistration("signup")}>Signup</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>


            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                
                type="Email"
                name = "email"
                value = {loginInput.email}
                onChange={(e) => changeInputHandler(e, "login")}
                placeholder = "Eg. Shukla Ji@gmail.com"   
                required="true" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="login-password">Password</Label>
                <Input 
                
                type="password" 
                name = "password"
                value = {loginInput.password}
                onChange={(e) => changeInputHandler(e, "login")} 
                placeholder = "Eg. Shukla_ji#542"
                required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleRegistration("login")}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Login;
