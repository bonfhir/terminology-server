# How to contribute to the Wiki

Add the Wiki as a subtree

```sh
git subtree add --prefix wiki wiki master
```

Deploy the Wiki

```sh
git subtree push --prefix wiki wiki master
```

Be careful when committing changes to the subtree. Do not mix the subtree changes with the main repository changes. Always commit the subtree changes separately.

## Open Questions

- How to add safeguard to prevent mixing the subtree changes with the main repository changes?
- How to automate the deployment of the subtree?
