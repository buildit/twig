export interface View {
  _id: String;
  name: String;
  description: String;
  display_name: String;
  link_types: ViewType;
  node_types: ViewType;
  fixed_nodes: FixedNodes;
  collapsed_nodes: Array<String>;
  nav: ViewNav;
}

export interface ViewType {

}

export interface FixedNodes {

}

export interface ViewNav {
  scale: String;
}

export interface Views {
  data: View[];
}
