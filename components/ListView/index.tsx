import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
import vendors from "../../common/browser/vendors";
vendors.pop();
vendors.map(vendor => vendor[0].toUpperCase() + vendor.slice(1));

const defaultProps: ListViewProps = __DEV__ ? require("./devDefaultProps").default : {};
interface Item {
	itemNode?: any;
	disable?: boolean;
	focus?: boolean;
}
export interface DataProps {
	items?: Item[];
}

interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface ListViewState {
	currItems?: Item[];
}

export default class ListView extends React.Component<ListViewProps, ListViewState> {
	static defaultProps: ListViewProps = {
		...defaultProps,
	};

	state: ListViewState = {
		currItems: this.props.items
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { items, ...attributes } = this.props;
		const { theme } = this.context;
		const { currItems } = this.state;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style),
				}}
			>
				{currItems.map((item, index) => {
					const { itemNode, disable, focus } = item;
					const { isDarkTheme } = theme;
					const defaultBG = focus ? theme[isDarkTheme ? "accentDarker2" : "accentLighter2"] : theme.chromeLow;
					const focusBG = focus ? theme[isDarkTheme ? "accentDarker1" : "accentLighter1"] : theme.chromeMedium;
					const clickBG = focus ? theme.accent : theme.chromeHigh;
					return (
						<div
							style={{
								background: defaultBG,
								color: disable ? theme.baseLow : theme.baseHigh,
								...styles.item,
							}}
							key={`${index}`}
							onMouseEnter={disable ? void(0) : (e) => {
								e.currentTarget.style.background = focusBG;
								if (itemNode.onMouseEnter) itemNode.onMouseEnter(e);
							}}
							onMouseLeave={disable ? void(0) : (e) => {
								e.currentTarget.style.background = defaultBG;
								if (itemNode.onMouseLeave) itemNode.onMouseLeave(e);
							}}
							onMouseDown={disable ? void(0) : (e) => {
								item.focus = true;
								this.setState({ currItems });
								for (const vendor of vendors) {
									e.currentTarget.style[`${vendor}Transform` as any] = "scale(0.99)";
								}
								e.currentTarget.style.transform = "scale(0.99)";
								e.currentTarget.style.background = clickBG;
								if (itemNode.onMouseLeave) itemNode.onMouseDown(e);
							}}
							onMouseUp={disable ? void(0) : (e) => {
								item.focus = false;
								for (const vendor of vendors) {
									e.currentTarget.style[`${vendor}Transform` as any] = "scale(1)";
								}
								e.currentTarget.style.transform = "scale(1)";
								e.currentTarget.style.background = defaultBG;
								if (itemNode.onMouseLeave) itemNode.onMouseUp(e);
							}}
						>
							{itemNode}
						</div>
					);
				})}
			</div>
		);
	}
}

function getStyles(listView: ListView): {
	container?: React.CSSProperties;
	item?: React.CSSProperties;
} {
	const { context } = listView;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		container: {
			fontSize: 14,
			padding: "8px 0",
			color: theme.baseMediumHigh,
			border: `1px solid ${theme.altHigh}`,
			background: theme.chromeLow,
		},
		item: prepareStyles({
			cursor: "default",
			padding: 8,
			transition: "all 0.25s 0s ease-in-out",
		}),
	};
}
