import express, { Request, Response, NextFunction } from "express";
import data from "./data";

const app = express();
const port = 3000;

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("----------");
    console.log("Data:", new Date());
    console.log("URL:", req.method, req.url);
    console.log("User Agent:", req.get('User-Agent'));
    next();
}

app.set("views", "./src/views");
app.set("view engine", "hbs");
app.use(logMiddleware);
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
    res.render("index", { title: "My Ecommerce", prodotti: data });
});

app.get("/prodotti/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
        res.status(400).send("Formato id non corretto.");
        return;
    }

    const prodotto = data.find(x => x.id == idNumber);

    if (prodotto) {
        res.render("prodotto", { title: prodotto.title, prodotto: prodotto });
    } else {
        res.status(404).render("404", { title: `Prodotto con id ${idNumber} non trovato.` });
    }
});

app.get("/api/prodotti", (req: Request, res: Response) => {
    res.json(data);
});

app.get("/api/prodotti/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
        res.status(400).json({ message: "Formato id non corretto." });
        return;
    }

    const prodotto = data.find(x => x.id == idNumber);

    if (prodotto) {
        res.json(prodotto);
    } else {
        res.status(404).json({ message: `Prodotto con id ${idNumber} non trovato.` });
    }
});

// errore 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send("Qualcosa è andato storto.");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});