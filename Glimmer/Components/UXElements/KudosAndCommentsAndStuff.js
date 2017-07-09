import React from "react";
import {TouchableOpacity, View} from "react-native";
//import {Badge} from "react-native-elements";
import GiKudos from "./GiKudos";
import VisKudos from "./VisKudos";
import * as colors from "../../src/Styles/colorConstants";
import Badge from "./Badge";

export default class KudosAndCommentsAndStuff extends React.Component {

    constructor(props) {
        super(props);
    }

    //Switch kudos section based on who created the post
    getKudosSection() {
        if (this.props.byMe) {
            var kudos = [];

            if (typeof this.props.post.kudos.from !== "undefined") {
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

    getCommentThing() {
        //If disabled, hide. Cause that's what you do.
        if (!this.props.showCommentBadge) return false;

        var comText = "kommentar";

        if (this.props.post.comment_count !== 1) {
            comText = "kommentarer";
        }

        return (
            <TouchableOpacity
                onPress={() => this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: this.props.post.title,
                    passProps: {post: this.props.post}
                })}
            >
                <Badge
                    text={this.props.post.comment_count + " " + comText}
                    color={colors.COLOR_ORANGE}
                    textColor={colors.COLOR_WHITE}
                />
            </TouchableOpacity>
        )

        /*
         return (

         <Badge
         value={this.props.post.comment_count + " " + comText}
         textStyle={{color: colors.COLOR_WHITE}}
         containerStyle={{backgroundColor: colors.COLOR_ORANGE}}

         />

         )
         */
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