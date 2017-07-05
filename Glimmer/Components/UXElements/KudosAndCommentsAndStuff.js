import React from "react";
import {View} from "react-native";
import {Badge} from "react-native-elements";
import GiKudos from "./GiKudos";
import VisKudos from "./VisKudos";
import * as colors from "../../Styles/colorConstants"

export default class KudosAndCommentsAndStuff extends React.Component {

    constructor(props) {
        super(props);
    }

    //Switch kudos section based on who created the post
    getKudosSection() {
        if (this.props.byMe) {
            var kudos = [];

            if(typeof this.props.post.kudos.from !== "undefined")
            {
                kudos = this.props.post.kudos.from;
            }

            return (<VisKudos kudos={kudos}/>)

        }
        else {
            var given = false;
            if (typeof(this.props.post.kudos.given) !== "undefined" && this.props.post.kudos.given) {
                given = true;
            }
            return (<GiKudos id={this.props.post.id} type="post" given={given}/>)
        }
    }

    getCommentThing()
    {
        //If disabled, hide. Cause that's what you do.
        if(!this.props.showCommentBadge) return false;

        var comText = "kommentar";

        if (this.props.post.comment_count !== 1) {
            comText = "kommentarer";
        }

        return (

            <Badge
                value={this.props.post.comment_count + " " + comText}
                textStyle={{color: colors.COLOR_WHITE}}
                containerStyle={{backgroundColor: colors.COLOR_ORANGE}}
                onPress={() => this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: this.props.post.title,
                    passProps: {post: this.props.post}
                })}
            />

        )
    }

    render() {

        return (

            <View style={{flexDirection: "row"}}>

                {this.getKudosSection()}

                {this.getCommentThing()}

            </View>
        )
    }
}