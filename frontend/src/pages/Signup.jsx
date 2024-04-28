import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";

import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";


export const Signup = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="bg-white rounded-lg w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign Up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox onChange={(e) => {
                        setFirstName(e.target.value);
                    }} placeholder="John" label={"First Name"} />
                    <InputBox onChange={(e) => {
                        setLastName(e.target.value);
                    }} placeholder="Doe" label={"Last Name"} />
                    <InputBox onChange={e => {
                        setUsername(e.target.value);
                    }} placeholder="vaishaant@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) => {
                        setPassword(e.target.value)
                    }} placeholder="123456" label={"Password"} />
                    <div className="pt-4">
                        <Button onClick={async () => {
                            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                                username: userName,
                                password: password,
                                firstName: firstName,
                                lastName: lastName
                            });
                            localStorage.setItem("token", response.data.token)
                            navigate("/dashboard")
                        }} label={"Sign Up"} />
                    </div>
                    <BottomWarning label={"Already have an account?"} bottomText={"Login"} to={"/signin"} />
                </div>
            </div>
        </div>
    )
}