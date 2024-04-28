import { useState } from "react"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { Button } from "../components/Button"
import { BottomWarning } from "../components/BottomWarning"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signin = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const naviagte = useNavigate();

    return (
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="bg-white w-80 p-2 rounded-lg text-center h-max">
                <Heading label={"Sign In"} />
                <SubHeading label={"Enter your credentials to access your account"} />
                <InputBox onChange={(e) => {
                    setUsername(e.target.value);
                }} label={"Email"} placeholder={"vaishant@gmail.com"}/>
                <InputBox onChange={(e) => {
                    setPassword(e.target.value);
                }} label={"Password"} />
                <div className="pt-4">
                <Button onClick={async () => {

                    const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                        username: username,
                        password: password
                    });
                    localStorage.setItem("token", response.data.token);
                    naviagte("/dashboard")
                }} label={"Sign In"} />
                </div>
                <BottomWarning label={"Don't have an account?"} bottomText={"Sign Up"} to={"/signup"}/>
            </div>
        </div>
    </div>
    )
}