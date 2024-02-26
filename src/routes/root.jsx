// import { Outlet } from "react-router-dom";
import MainMenu from "../components/MainMenu";

export default function Root() {
  return (
    <div>
      <MainMenu />
      <div className="content">
        {/* <Outlet /> */}
      </div>
    </div>
  );
}
