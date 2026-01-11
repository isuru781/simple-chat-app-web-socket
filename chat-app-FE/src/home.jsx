import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <button onClick={() => navigate("/public-chat")}>Public Chat</button>
            <button onClick={() => navigate("/pvt")}>Private Chat</button>





        </div>


    )
}

export default Home;