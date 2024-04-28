export function Appbar() {
    return <div className="flex justify-between h-14 shadow">
        <div className="text-lg font-bold flex flex-col justify-center h-full ml-4">Payments App</div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello,  User 
            </div>
            <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center  mt-2 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
        </div>
    </div>
}