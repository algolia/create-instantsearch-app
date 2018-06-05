import UIKit
import InstantSearch
import InstantSearchCore
import Nuke

class ViewController: HitsTableViewController {


    @IBOutlet weak var tableView: HitsTableWidget!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        // Register all widgets in view to InstantSearch
        InstantSearch.shared.registerAllWidgets(in: self.view)

        hitsTableView = tableView
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath, containing hit: [String : Any]) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "hitCell", for: indexPath)

        cell.textLabel?.highlightedTextColor = .blue
        cell.textLabel?.highlightedBackgroundColor = .yellow
        cell.textLabel?.highlightedText = SearchResults.highlightResult(hit: hit, path: "name")?.value

        cell.imageView?.frame = CGRect(x: 0, y: 0, width: 50, height: 50)

        if let imageString = hit["image"] as? String, let imageURL = URL(string: imageString) {
            Nuke.loadImage(
                with: imageURL,
                options: ImageLoadingOptions(
                    placeholder: #imageLiteral(resourceName: "ProductPlaceholder"),
                    transition: .fadeIn(duration: 0.33)
                ),
                into: cell.imageView!
            )
        }

        return cell
    }


}

