from pathlib import Path

OTHER = "\u05d0\u05d7\u05e8"

PET_BREEDS_BY_CATEGORY = {
    "\u05db\u05dc\u05d1\u05d9\u05dd": [
        "\u05d2\u05d5\u05dc\u05d3\u05df \u05e8\u05d8\u05e8\u05d9\u05d1\u05e8",
        "\u05dc\u05d1\u05e8\u05d3\u05d5\u05e8",
        "\u05e8\u05d5\u05e2\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9",
        "\u05e8\u05d5\u05e2\u05d4 \u05d1\u05dc\u05d2\u05d9",
        "\u05d4\u05d0\u05e1\u05e7\u05d9",
        "\u05de\u05dc\u05d8\u05d6",
        "\u05e4\u05d5\u05d3\u05dc",
        "\u05d9\u05d5\u05e8\u05e7\u05e9\u05d9\u05d9\u05e8",
        "\u05e9\u05d9\u05e6\u05d5",
        "\u05d1\u05d9\u05d2\u05dc",
        "\u05d1\u05d5\u05e7\u05e1\u05e8",
        "\u05d3\u05d5\u05d1\u05e8\u05de\u05df",
        "\u05e8\u05d5\u05d8\u05d5\u05d5\u05d9\u05dc\u05e8",
        "\u05e6\u05f3\u05d9\u05d5\u05d5\u05d0\u05d4",
        "\u05e1\u05d0\u05de\u05d5\u05d9\u05d3",
        "\u05e4\u05d5\u05de\u05e8\u05e0\u05d9\u05d9\u05df",
        "\u05e8\u05d5\u05e2\u05d4 \u05d0\u05d5\u05e1\u05d8\u05e8\u05dc\u05d9",
        "\u05e4\u05d9\u05d8\u05d1\u05d5\u05dc",
        "\u05d3\u05dc\u05de\u05d8\u05d9",
        "\u05de\u05e2\u05d5\u05e8\u05d1",
        OTHER,
    ],
    "\u05d7\u05ea\u05d5\u05dc\u05d9\u05dd": [
        "\u05e4\u05e8\u05e1\u05d9",
        "\u05e1\u05d9\u05d0\u05de\u05d9",
        "\u05de\u05d9\u05d9\u05df \u05e7\u05d5\u05df",
        "\u05d1\u05e8\u05d9\u05d8\u05d9 \u05e7\u05e6\u05e8 \u05e9\u05d9\u05e2\u05e8",
        "\u05e1\u05e7\u05d5\u05d8\u05d9\u05e9 \u05e4\u05d5\u05dc\u05d3",
        "\u05e1\u05e4\u05d9\u05e0\u05e7\u05e1",
        "\u05e8\u05d2\u05d3\u05d5\u05dc",
        "\u05d1\u05e0\u05d2\u05dc",
        "\u05d7\u05ea\u05d5\u05dc \u05de\u05e2\u05d5\u05e8\u05d1",
        "\u05de\u05e2\u05d5\u05e8\u05d1",
        OTHER,
    ],
    "\u05e6\u05d9\u05e4\u05d5\u05e8\u05d9\u05dd": [
        "\u05e7\u05d5\u05e7\u05d8\u05d9\u05d9\u05dc",
        "\u05ea\u05d5\u05db\u05d9",
        "\u05ea\u05d5\u05db\u05d9 \u05d0\u05e4\u05e8\u05d9\u05e7\u05d0\u05d9",
        "\u05db\u05e0\u05e8\u05d9\u05ea",
        "\u05e6\u05d9\u05e4\u05d5\u05e8 \u05d0\u05d4\u05d1\u05d4",
        "\u05d6\u05e8\u05d6\u05d9\u05e8",
        "\u05d9\u05d5\u05e0\u05ea \u05e0\u05d5\u05d9",
        "\u05e0\u05d0\u05e0\u05d3\u05d0\u05d9",
        OTHER,
    ],
    "\u05d3\u05d2\u05d9\u05dd": [
        "\u05d2\u05d5\u05dc\u05d3\u05e4\u05d9\u05e9",
        "\u05d2\u05d5\u05e4\u05d9",
        "\u05de\u05d5\u05dc\u05d9",
        "\u05e4\u05dc\u05d8\u05d9",
        "\u05d3\u05d2 \u05e7\u05e8\u05d1",
        "\u05d8\u05d8\u05e8\u05d4",
        "\u05d3\u05d9\u05e1\u05e7\u05d5\u05e1",
        "\u05e7\u05d5\u05d9",
        OTHER,
    ],
    "\u05d0\u05e8\u05e0\u05d1\u05d9\u05dd": [
        "\u05d0\u05e8\u05e0\u05d1 \u05e0\u05e0\u05e1\u05d9",
        "\u05e0\u05e0\u05e1\u05d9 \u05d4\u05d5\u05dc\u05e0\u05d3\u05d9",
        "\u05d4\u05d5\u05dc\u05e0\u05d3 \u05dc\u05d5\u05e4",
        "\u05d0\u05e0\u05d2\u05d5\u05e8\u05d4",
        "\u05dc\u05d9\u05d0\u05d5\u05df \u05d4\u05d3",
        "\u05d3\u05d0\u05d5\u05d5\u05d2",
        OTHER,
    ],
    "\u05d6\u05d5\u05d7\u05dc\u05d9\u05dd": [
        "\u05d2\u05e7\u05d5 \u05de\u05e0\u05d5\u05de\u05e8",
        "\u05d1\u05d5\u05d2\u05e8 \u05d6\u05d9\u05e7\u05df",
        "\u05e0\u05d7\u05e9 \u05ea\u05d9\u05e8\u05e1",
        "\u05e6\u05d1",
        "\u05d9\u05e8\u05d1\u05d5\u05e2",
        "\u05d0\u05d9\u05d2\u05d5\u05d0\u05e0\u05d4",
        OTHER,
    ],
    "\u05ea\u05e8\u05e0\u05d2\u05d5\u05dc\u05d5\u05ea": [
        "\u05ea\u05e8\u05e0\u05d2\u05d5\u05dc",
        "\u05ea\u05e8\u05e0\u05d2\u05d5\u05dc\u05ea",
        "\u05dc\u05d2\u05d4\u05d9\u05d4\u05d5\u05e8\u05df",
        "\u05d1\u05e8\u05d5\u05d5\u05d6",
        "\u05d0\u05d5\u05d6",
        "\u05d4\u05d5\u05d3\u05d5",
        OTHER,
    ],
    "\u05d7\u05d9\u05d5\u05ea \u05de\u05e9\u05e7": [
        "\u05e2\u05d6",
        "\u05db\u05d1\u05e9",
        "\u05e4\u05e8\u05d4",
        "\u05d7\u05de\u05d5\u05e8",
        "\u05d2\u05de\u05dc",
        "\u05d7\u05d6\u05d9\u05e8",
        OTHER,
    ],
    "\u05d7\u05d9\u05d5\u05ea \u05e7\u05d8\u05e0\u05d5\u05ea": [
        "\u05d0\u05d5\u05d2\u05e8",
        "\u05d0\u05d5\u05d2\u05e8 \u05de\u05d5\u05e0\u05d2\u05d5\u05dc\u05d9",
        "\u05e9\u05e8\u05e7\u05df",
        "\u05e6\u05d9\u05e0\u05e6\u05d9\u05dc\u05d4",
        "\u05d7\u05d5\u05dc\u05d3\u05d4",
        "\u05e2\u05db\u05d1\u05e8",
        OTHER,
    ],
}


def render_category_key(category: str) -> str:
    if " " in category:
        return f'"{category}"'
    return category


def main() -> None:
    lines = [
        'export const PET_BREED_OTHER = "\u05d0\u05d7\u05e8";',
        "",
        "export const PET_BREEDS_BY_CATEGORY = {",
    ]

    for category, items in PET_BREEDS_BY_CATEGORY.items():
        lines.append(f"  {render_category_key(category)}: [")
        for item in items:
            if item == OTHER:
                lines.append("    PET_BREED_OTHER,")
            else:
                lines.append(f'    "{item}",')
        lines.append("  ],")

    lines.extend(
        [
            "};",
            "",
            "export const getPetBreeds = (categoryName) =>",
            "  PET_BREEDS_BY_CATEGORY[categoryName] || [PET_BREED_OTHER];",
            "",
            "export const resolvePetBreed = (breed, breedCustom) => {",
            "  if (breed !== PET_BREED_OTHER) return breed;",
            "  return breedCustom?.trim() || PET_BREED_OTHER;",
            "};",
            "",
            "export const isOtherBreedSelection = (breed) => breed === PET_BREED_OTHER;",
            "",
        ]
    )

    Path("/workspace/src/data/pet-breeds.js").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
