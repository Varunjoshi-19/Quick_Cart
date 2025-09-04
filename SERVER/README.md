# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

JUST FOR DEVELOPMENT --- 

{
     
 "start": "nodemon --watch src --ext ts --exec bun run ./src/main/server.ts",

    "seed:test-products": "bun run ./src/scripts/seedTestingProducts.ts"

}