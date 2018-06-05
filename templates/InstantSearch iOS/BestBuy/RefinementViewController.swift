import UIKit
import InstantSearch

class RefinementViewController: UIViewController, RefinementTableViewDataSource {

    @IBOutlet weak var tableView: RefinementTableWidget!
    var refinementController: RefinementController!

    override func viewDidLoad() {
        refinementController = RefinementController(table: tableView)
        tableView.dataSource = refinementController
        tableView.delegate = refinementController
        refinementController.tableDataSource = self

        InstantSearch.shared.register(widget: tableView)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath, containing facet: String, with count: Int, is refined: Bool) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "refinementCell", for: indexPath)

        cell.textLabel?.text = facet
        cell.detailTextLabel?.text = String(count)
        cell.accessoryType = refined ? .checkmark : .none

        return cell
    }
}
