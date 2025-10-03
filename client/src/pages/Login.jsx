import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"

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
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "features/apis/authApi"
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerisLoading, isSuccess: registerisSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginisLoading, isSuccess: loginisSuccess }] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  }

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };
  useEffect(() => {
    if (registerData && registerisSuccess) {
      toast.success(registerData.message || "Signup Successful");
    }
    if (registerError) {
      toast.error(registerError?.data?.message || "Signup Failed");
    }
    if (loginData && loginisSuccess) {
      toast.success(loginData.message || "Login Successful");
    }
    if (loginError) {
      toast.error(loginError?.data?.message || "Login Failed");
    }
  }, [loginisLoading, registerisLoading, loginData, registerData, loginError, registerError]);


  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Tabs className="w-[400px]" defaultValue="signup">
        <TabsList className="grid w-full grid-cols-2">
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
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Shukla Ji"
                  required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Shukla Ji@gmail.com"
                  required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Shukla_ji#542"
                  required />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerisLoading} onClick={() => handleRegistration("signup")}>
                {registerisLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
            {registerError && (
              <p className="text-red-500 text-sm mt-2">
                {registerError?.data?.message || "Something went wrong"}
              </p>
            )}

            {registerisSuccess && (
              <p className="text-green-500 text-sm mt-2">
                Signup successful 🎉
              </p>
            )}
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
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. Shukla Ji@gmail.com"
                  required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="login-password">Password</Label>
                <Input

                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. Shukla_ji#542"
                  required />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginisLoading} onClick={() => handleRegistration("login")}>
                {loginisLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Login;
