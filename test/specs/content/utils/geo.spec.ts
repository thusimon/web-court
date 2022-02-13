import { getUsernamePasswordGeoFeature } from '@src/content/utils/geo';
import { InputFieldType } from '@src/constants';
import { setupInputDoms } from '../../../utils/dom';

interface ContextType {
  sandbox?: HTMLDivElement
};

describe('getUsernamePasswordGeoVector', () => {
  let ctx: ContextType = {}
  beforeEach(() => {
    global.document = window.document;
    global.getComputedStyle = global.document.defaultView.getComputedStyle;
    ctx.sandbox = document.createElement('div');
    document.body.innerHTML = '';
    document.body.append(ctx.sandbox);
    document.body.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 100,
      height: 200
    });
  });
  it('get 6 username input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 6);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(6);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(4);
  });
  it('get 10 username input features at most', () => {
    setupInputDoms(ctx.sandbox, 'text', 20);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(10);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
  it('get 6 password input features', () => {
    setupInputDoms(ctx.sandbox, 'password', 6);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(6);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(4);
  });
  it('get 10 password input features at most', () => {
    setupInputDoms(ctx.sandbox, 'password', 20);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(10);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
  it('get 3 username and 2 password input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 3);
    setupInputDoms(ctx.sandbox, 'password', 2);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(3);
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(2);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(5);
  });
  it('get 9 username and 1 password input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 9);
    setupInputDoms(ctx.sandbox, 'password', 1);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(9);
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(1);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
  it('get 7 username and 3 password input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 16);
    setupInputDoms(ctx.sandbox, 'password',3);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(7);
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(3);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
  it('get 2 username and 8 password input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 2);
    setupInputDoms(ctx.sandbox, 'password',12);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(2);
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(8);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
  it('get 5 username and 5 password input features', () => {
    setupInputDoms(ctx.sandbox, 'text', 8);
    setupInputDoms(ctx.sandbox, 'password',5);
    const features = getUsernamePasswordGeoFeature();
    expect(features.filter(f => f.type == InputFieldType.username)).toHaveLength(5);
    expect(features.filter(f => f.type == InputFieldType.password)).toHaveLength(5);
    expect(features.filter(f => f.type == InputFieldType.other)).toHaveLength(0);
  });
});
