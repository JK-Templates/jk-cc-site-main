import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Codex from './pages/Codex';
import AIPrompts from './pages/AIPrompts';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AIVideos from './pages/AIVideos';
import Base44 from './pages/Base44';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Portfolio": Portfolio,
    "Codex": Codex,
    "AIPrompts": AIPrompts,
    "Contact": Contact,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "AIVideos": AIVideos,
    "Base44": Base44,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};