# Browser-Only Migration and Cleanup

## Goal

Move GemgineTS to a clean browser-only TypeScript project with one authoritative development and production build path. Do not carry Electron, stale generated output, or obsolete package configuration into the new project.

Keep the current repository available as a reference until the migrated editor can load, edit, and save projects reliably.

## Target Stack

- Vite
- Vanilla TypeScript
- Browser APIs
- Vitest for model and storage tests
- IndexedDB for project documents and assets
- `localStorage` for small preferences and recent-project metadata
- File System Access API for optional local disk synchronization
- JSON import/download as a cross-browser fallback
- GitHub API integration as a later, optional sync provider

Electron, Webpack, and Node APIs should not be used by browser application code.

## Suggested Project Layout

```text
gemgine-editor/
  public/
    data/
  src/
    demos/
    editor/
    engine/
    storage/
    sync/
    main.ts
  tests/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

The existing demo entry points have already been moved to `src/demos/`. Preserve that layout during migration.

## Create the Clean Project

Create a sibling directory rather than rebuilding the existing repository in place:

```powershell
npm create vite@latest gemgine-editor -- --template vanilla-ts
Set-Location gemgine-editor
npm install
npm install --save-dev vitest
```

Start a new Git repository if independent history is desired. Make one commit after each successful migration stage.

## Selective Copy

Copy only what is understood and still needed:

- Required TypeScript source from `src/`
- Demo entry points from `src/demos/`
- Runtime assets from `data/`
- Relevant HTML and CSS concepts
- Tests and current documentation

Do not copy generated or obsolete infrastructure:

- `node_modules/`
- `build/`
- `dist/`
- Generated `docs/`
- Electron main, preload, renderer bridge, or packaging artifacts
- Electron IPC types and adapters such as `EditorDiscApi`
- `webpack.config.js`
- Old package lock data; generate a new lock file with `npm install`
- Launch pages that are no longer useful
- Source maps and generated JavaScript

Review `old/` manually. Copy an item only when a migrated feature demonstrably requires it.

## Remove Electron From the Current Repository

If cleaning the current repository before migration, remove Electron in this order:

1. Delete source-controlled Electron main and preload entry points, if any are recovered or added.
2. Remove Electron IPC calls such as `choose-file` and `read-file`.
3. Remove renderer references to `window.electronAPI`.
4. Remove `EditorDiscApi` after its callers have moved to browser-neutral storage interfaces.
5. Remove Electron-specific Vite plugins and configuration.
6. Remove Electron dependencies and scripts from `package.json`.
7. Reinstall dependencies to refresh `package-lock.json`.
8. Delete generated Electron output under `dist/main` and related directories.
9. Confirm that no application module imports Node built-ins such as `fs` or `path`.

The current `vite.config.ts` imports `vite-plugin-electron-renderer`; remove that plugin and its dependency for a browser-only build.

After editing `package.json`, refresh dependencies with:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Only run those destructive cleanup commands after confirming the new `package.json` contains the desired dependencies.

## Establish One Build Path

Use Vite as the canonical path from source to the running browser application:

```text
src/**/*.ts + index.html
        |
        v
Vite development server / production build
        |
        v
dist/
```

Recommended scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

Use `npm run dev` during development and `npm run build` for deployment. Treat `dist/` as generated output and do not edit or commit it unless deployment requires committed artifacts.

Vite can use plain TypeScript; React or another framework is not required.

## Migrate in Small Batches

Move code in dependency order and type-check after each batch:

1. Core value types and dependency-free utilities.
2. Asset types, loaders, and rendering infrastructure.
3. Engine modules and components.
4. Project and editor abstractions.
5. Browser application entry point.
6. Local project persistence.
7. Demo entry points that are still useful.
8. Optional disk synchronization.
9. Optional GitHub synchronization.

Initially preserve the existing `.js` suffixes in TypeScript imports where Vite resolves them correctly. Change import style separately if desired, rather than combining it with the migration.

## Project Storage Boundary

Do not make `EditorHarness` directly manage `localStorage`, files, or GitHub. Depend on a browser-neutral repository:

```ts
interface ProjectStore {
  list(): Promise<ProjectSummary[]>;
  load(id: string): Promise<StoredProject>;
  save(project: StoredProject): Promise<void>;
  delete(id: string): Promise<void>;
}
```

Persist a versioned data envelope rather than serializing class instances directly:

```ts
interface StoredProject {
  schemaVersion: number;
  id: string;
  revision: number;
  updatedAt: string;
  project: ProjectData;
  sync?: {
    disk?: DiskSyncState;
    github?: GitHubSyncState;
  };
}
```

Separate responsibilities:

- `LocalProjectStore`: authoritative local working copy
- `ProjectSession`: dirty state, autosave, revisions, and conflicts
- `DiskSyncProvider`: optional import, export, or file mirroring
- `GitHubSyncProvider`: optional remote pull and push
- `EditorHarness`: project selection, tabs, errors, and sync status

## Browser Storage Method

Use IndexedDB as the authoritative store for project documents, binary assets, and retained browser file handles. Use `localStorage` only for small synchronous data such as preferences, recent project IDs, and possibly a lightweight project index.

For autosave:

- Debounce writes by roughly 300 to 1000 milliseconds.
- Validate and migrate `schemaVersion` during loading.
- Track monotonically increasing local revisions.
- Report quota and serialization failures visibly.
- Detect modifications from another tab.

`localStorage` is synchronous and commonly limited to roughly 5 to 10 MB, so it should not become the primary asset database.

## Optional Disk Synchronization

In supported browsers, use the File System Access API:

- File or directory selection must begin from a user gesture.
- Persist `FileSystemFileHandle` values in IndexedDB, not `localStorage`.
- Expect permissions to require confirmation again after a restart.
- Provide JSON upload and download when the API is unavailable.
- Write through a temporary file or equivalent safe replacement method where possible.

Track the content hash or revision from the last successful disk sync. If both local and disk copies changed from that base, enter a conflict state instead of silently overwriting either copy.

## Optional GitHub Synchronization

Add GitHub only after local save and conflict handling are reliable:

- Store repository, branch, path, and last known blob SHA as sync metadata.
- Pull before pushing when the remote state is unknown.
- Push conditionally using the last known SHA.
- On a SHA mismatch, fetch remote content and surface a conflict.
- Begin with explicit Pull and Push commands.
- Add background synchronization only after failures and conflicts are understandable to users.
- Never store a long-lived personal access token in `localStorage`.
- Prefer OAuth and short-lived credentials.

For multi-file projects, GitHub's Git Data API can create one tree and commit atomically. For a single project file, the Contents API is simpler.

## Local-First Sync Model

Local persistence should complete independently of disk and GitHub. Record pending sync work in an outbox and process it asynchronously.

A project remains editable when:

- The browser is offline.
- GitHub is unavailable.
- File permissions expire.
- A remote revision conflicts.

Expose sync status without treating sync failure as local save failure.

## Completion Checklist

- `npm run dev` launches the editor in a browser.
- `npm run build` type-checks and produces one `dist/` application.
- No Electron package, plugin, API, IPC channel, or generated output remains.
- No browser module imports Node built-ins.
- Demos import successfully from `src/demos/`.
- Projects survive reload through IndexedDB.
- Invalid or old project schemas produce a controlled migration error.
- JSON import and export work without the File System Access API.
- Disk sync detects concurrent changes before overwriting.
- GitHub sync detects SHA conflicts before overwriting.
- Tests cover project serialization, schema migration, local persistence, and conflict decisions.
