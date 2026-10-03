export type EditorDiscApi = {
    ChooseFile() : Promise<string>,
    ReadFile(path: string) : Promise<string>
}
