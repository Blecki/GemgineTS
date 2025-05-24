using System.Text.Json;

string rootDirectory = Directory.GetCurrentDirectory();
string relativeAssetDirectory = "../../../../../data/";
string dataDirectory = Path.GetFullPath(Path.Combine(rootDirectory, relativeAssetDirectory));
var files = ListFiles(dataDirectory);
var fileArray = files.Where(f => f.StartsWith("assets")).Select(f => f.Replace("\\", "/")).ToArray();
var options = new JsonSerializerOptions { WriteIndented = true };
string json = JsonSerializer.Serialize(fileArray, options);
await File.WriteAllTextAsync(Path.Combine(dataDirectory, "manifest.json"), json);
Console.WriteLine("Generated manifest.");

List<string> ListFiles(string directory)
{
  var r = new List<string>();
  foreach (string file in Directory.GetFiles(directory))
    r.Add(file.Substring(dataDirectory.Length));

  foreach (string subDir in Directory.GetDirectories(directory))
    r.AddRange(ListFiles(subDir));

  return r;
}
