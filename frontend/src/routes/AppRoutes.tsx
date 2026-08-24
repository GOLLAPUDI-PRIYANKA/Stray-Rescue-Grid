import { Routes, Route } from "react-router-dom";

function Home() {
  return <h1>Stray Rescue Grid</h1>;
}

function NotFound() {
  return <h1>Page Not Found</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}