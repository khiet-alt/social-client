import { Popup } from "semantic-ui-react";

export default function MyPopup({content, children}: any) {
    return (
        <Popup inverted content={content} trigger={children} />
    )
}
