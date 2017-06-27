/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Card, Icon} from "react-native-elements";

export default class AddCommentBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: 'Useless Placeholder'};
    }

    render() {

        var title = "Ny kommentar til "+ this.props.title;

        return (
            <Card>
                <Icon
                    reverse
                    color='#517fa4'
                    name='comment'
                    onPress={()=>{
                        this.props.navigator.showModal({
                            screen: 'glimmer.PageNewForumPost',
                            title: title,
                            passProps: {navigator: this.props.navigator}
                        });
                    }}
                />
            </Card>
        )

    }

}