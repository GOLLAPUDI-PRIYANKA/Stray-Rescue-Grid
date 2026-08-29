import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

function Home() {
  return <h1 className="text-2xl font-bold">Stray Rescue Grid</h1>;
}

function NotFound() {
  return <h1 className="text-2xl font-bold">Page Not Found</h1>;
}

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}