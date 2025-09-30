import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaChevronDown, FaEye, FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
export default function ModulesControls() {
    return (
        <div id="wd-modules-controls" className="text-nowrap">
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Module
            </Button>
            <Dropdown className="float-end me-2">
                <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
                    <GreenCheckmark /> Publish All
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem id="wd-publish-all">
                        <GreenCheckmark /> Publish All
                    </DropdownItem>
                    <DropdownItem id="wd-publish-all-modules-and-items">
                        <GreenCheckmark /> Publish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-publish-modules-only">
                        <GreenCheckmark /> Publish modules only
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-all-modules-and-items">
                        <GreenCheckmark /> Unpublish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-modules-only">
                        <GreenCheckmark /> Unpublish modules only
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            {/* Implement the View Progress and Collapse All buttons with IDs wd-view-progress and wd-collapse-all */}
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
                <FaEye className="position-relative me-2" style={{ bottom: "1px" }} />
                View Progress
            </Button>
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-collapse-all">
                <FaChevronDown className="position-relative me-2" style={{ bottom: "1px" }} />
                Collapse All
            </Button>
        </div>
    );
}
