"use client";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
    const pathname = usePathname();

    const getItemClasses = (path: string) => {
        const isActive = pathname === path || pathname.startsWith(path + '/');
        return `border-0 text-center ${isActive ? 'bg-white' : 'bg-black'}`;
    };

    const getLinkClasses = (path: string) => {
        const isActive = pathname === path || pathname.startsWith(path + '/');
        return `text-decoration-none ${isActive ? 'text-danger' : 'text-white'}`;
    };

    const getIconClasses = (path: string) => {
        const isActive = pathname === path || pathname.startsWith(path + '/');
        return `fs-1 ${isActive ? 'text-danger' : 'text-white'}`;
    };

    return (
        <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 120 }}
            id="wd-kambaz-navigation">
            <ListGroupItem className="bg-black border-0 text-center" as="a"
                target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
                <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
            </ListGroupItem>
            <ListGroupItem className={getItemClasses('/Account')}>
                <Link href="/Account" id="wd-account-link" className={getLinkClasses('/Account')}>
                    <FaRegCircleUser className={getIconClasses('/Account')} />
                    <br />
                    Account
                </Link>
            </ListGroupItem>
            <ListGroupItem className={getItemClasses('/Dashboard')}>
                <Link href="/Dashboard" id="wd-dashboard-link" className={getLinkClasses('/Dashboard')}>
                    <AiOutlineDashboard className={getIconClasses('/Dashboard')} />
                    <br />
                    Dashboard
                </Link>
            </ListGroupItem>
            <ListGroupItem className={getItemClasses('/Calendar')}>
                <Link href="/Calendar" id="wd-calendar-link" className={getLinkClasses('/Calendar')}>
                    <IoCalendarOutline className={getIconClasses('/Calendar')} />
                    <br />
                    Calendar
                </Link>
            </ListGroupItem>
            <ListGroupItem className={getItemClasses('/Inbox')}>
                <Link href="/Inbox" id="wd-inbox-link" className={getLinkClasses('/Inbox')}>
                    <FaInbox className={getIconClasses('/Inbox')} />
                    <br />
                    Inbox
                </Link>
            </ListGroupItem>
            <ListGroupItem className={getItemClasses('/Labs')}>
                <Link href="/Labs" id="wd-labs-link" className={getLinkClasses('/Labs')}>
                    <LiaBookSolid className={getIconClasses('/Labs')} />
                    <br />
                    Labs
                </Link>
            </ListGroupItem>
        </ListGroup>
    );
}
