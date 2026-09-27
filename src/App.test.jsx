import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { DOCUMENTS } from "./data/documents";
import { filterDocuments, highlightParts, matchesQuery } from "./lib/search";

const cards = () => screen.getAllByRole("article");

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("búsqueda", () => {
  it("ignora tildes y mayúsculas", () => {
    const doc = DOCUMENTS.find((d) => d.id === "inv-02");
    expect(matchesQuery(doc, "investigacion")).toBe(true);
    expect(matchesQuery(doc, "DISEÑOS")).toBe(true);
    expect(matchesQuery(doc, "agricultura")).toBe(false);
  });

  it("filtra por categoría y ordena", () => {
    const res = filterDocuments(DOCUMENTS, { cat: "sintesis", q: "", sort: "number" });
    expect(res.map((d) => d.id)).toEqual(["sin-01", "sin-02", "sin-03"]);
    const recent = filterDocuments(DOCUMENTS, { cat: "investigacion", q: "", sort: "recent" });
    expect(recent[0].id).toBe("inv-06");
  });

  it("resalta coincidencias sin tildes", () => {
    const parts = highlightParts("Educación digital", "educacion");
    expect(parts[0]).toEqual({ text: "Educación", hit: true });
  });
});

describe("datos", () => {
  it("cada documento tiene archivo, miniatura y metadatos", () => {
    expect(DOCUMENTS).toHaveLength(10);
    for (const d of DOCUMENTS) {
      expect(d.file).toMatch(/documents\/.+\.pdf$/);
      expect(d.pages).toBeGreaterThan(0);
      expect(d.sizeKB).toBeGreaterThan(0);
    }
  });
});

describe("App", () => {
  it("renderiza todos los documentos agrupados", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(cards()).toHaveLength(10);
    expect(screen.getByRole("heading", { name: "Síntesis", level: 2 })).toBeInTheDocument();
  });

  it("filtra por categoría y lo refleja en la URL", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("radio", { name: /Síntesis/ }));
    expect(cards()).toHaveLength(3);
    expect(window.location.search).toBe("?cat=sintesis");
  });

  it("busca sin distinguir tildes", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Buscar documentos"), "agricola");
    expect(await screen.findByText(/Mostrando 1 de 10/)).toBeInTheDocument();
  });

  it("muestra estado vacío y permite limpiar", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Buscar documentos"), "zzzz");
    await user.click(await screen.findByRole("button", { name: "Limpiar filtros" }));
    expect(screen.getByLabelText("Buscar documentos")).toHaveValue("");
  });

  it("abre el visor con deep link y lo cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    const card = cards()[0];
    await user.click(within(card).getByRole("button", { name: /^Leer/ }));
    const dialog = await screen.findByRole("dialog");
    expect(window.location.hash).toBe(`#/doc/${DOCUMENTS[0].slug}`);
    expect(within(dialog).getByRole("heading", { name: DOCUMENTS[0].title })).toBeInTheDocument();
    await act(async () => {
      await user.keyboard("{Escape}");
    });
    expect(window.location.hash).toBe("");
  });

  it("abre un documento directamente desde la URL", async () => {
    window.history.replaceState(null, "", `/#/doc/${DOCUMENTS[9].slug}`);
    render(<App />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});
