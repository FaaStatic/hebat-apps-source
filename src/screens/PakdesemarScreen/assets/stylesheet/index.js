import { colorApp } from "../../../../util/globalvar"
export const stylesheet = {
  container: {
    backgroundColor: colorApp.primary,
    flex: 1,
  },
  pages: {
    flex: 1,
    // paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colorApp.primary,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: 0,
  },
  textLoader: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 3,
  },
};