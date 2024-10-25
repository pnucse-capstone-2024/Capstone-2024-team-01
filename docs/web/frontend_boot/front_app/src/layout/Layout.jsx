import { Outlet } from "react-router";
import Top from "../top/Top";
import Side from "../side/Side";


//우리가 만드는 앱의 전체 화면 구조를 잡는 역할.. 
const Layout = () => {
    return (
        <>
            <Top />
            <Side/>
            {/* router 에 의해 결정된 화면을 출력하는 위치... */}
            <Outlet />
        </>
    )
}
export default Layout