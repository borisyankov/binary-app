import React, { PureComponent } from 'react';

export default class ArticlePreview extends PureComponent {
    props: {
        title: string,
        description: string,
        url: string,
    };

    openArticle = () => {
        const { url } = this.props;
        window.open(url, '_blank');
    };

    render() {
        const { description, title } = this.props;

        return (
            <a className="article-preview" onClick={this.openArticle}>
                <h2>{title}</h2>
                <p dangerouslySetInnerHTML={{ __html: description }} />
            </a>
        );
    }
}
