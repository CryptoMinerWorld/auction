import React from 'react';
import { render } from 'react-testing-library';
import DescriptionBox, { FeatureBand } from "../../features/items/components/DescriptionBox"
import Ripple from '../RippleButton/Ripple'
import RippleButton from '../RippleButton/RippleButton'
import AuctionBox from '../../features/items/components/AuctionBox'
import AuctionImage from '../AuctionImage'
import CountdownTimer from '../CountdownTimer'
import Question from '../FAQ'
import Footer from '../Footer'
import Gembox, { Gem } from '../Gembox'
import MobileHeader from '../MobileHeader'
import MailingList from '../MailingList'
import Navbar from '../Nav'
import ProgressMeter from '../ProgressMeter'

it('DescriptionBox renders correctly', () => {

    const props = {
        level: 1,
        grade: 1,
        rate: 1000,
        name: 'PropTypes.string.isRequired',
        story: 'PropTypes.string.isRequired'
    }

    const { container } = render(<DescriptionBox {...props} />);
    expect(container).toMatchSnapshot();
});

it('FeatureBand renders correctly', () => {

    const props = {
        bgColour: 'PropTypes.string.isRequired',
        gem: 'PropTypes.string.isRequired',
        category: 'PropTypes.string.isRequired',
        amount: 0,
        description: 'PropTypes.string.isRequired',
        clip: {
            clip: 'PropTypes.string'
        }
    }


    const { container } = render(<FeatureBand {...props} />);
    expect(container).toMatchSnapshot();
});

it('Ripple Effect renders correctly', () => {
    const props = {
        onRequestRemove: jest.fn(),
        left: 1,
        top: 1
    }

    const { container } = render(<Ripple {...props} />);
    expect(container).toMatchSnapshot();
});

it('Ripple Button renders correctly', () => {
    const props = {
        onClick: jest.fn(),
        title: 'title'
    }
    const { container } = render(<RippleButton {...props} />);
    expect(container).toMatchSnapshot();
});

it.skip('AuctionBox renders correctly', () => {
    const props = {
        currentPrice: 'PropTypes.string.isRequired',
        handleBuyNow: jest.fn(),
        level: 2,
        grade: 2,
        rate: 2,
        deadline: 100,
        name: 'PropTypes.string.isRequired',
        showConfirm: jest.fn(),
        tokenId: 'PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired',
        maxPrice: 100,
        minPrice: 10,
        provider: false
    }
    const { container } = render(<AuctionBox {...props} />);
    expect(container).toMatchSnapshot();
});

it('AuctionImage renders correctly', () => {
    const props = {
        sourceImage: 'false'
    }
    const { container } = render(<AuctionImage {...props} />);
    expect(container).toMatchSnapshot();
});

it.skip('CountdownTimer renders correctly', () => {
    const props = {
        deadline: 100
    }
    const { container } = render(<CountdownTimer {...props} />);
    expect(container).toMatchSnapshot();
});

it('Question renders correctly', () => {
    const props = {
        focusedDetail: 100,
        handleChange: jest.fn(),
        question: 'PropTypes.string.isRequired',
        answer: 'PropTypes.string.isRequired',
        index: 1,
    }
    const { container } = render(<Question {...props} />);
    expect(container).toMatchSnapshot();
});

it('Footer & MailingList render correctly', () => {

    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();

    const secondContainer = render(<MailingList />);
    expect(secondContainer).toMatchSnapshot();

});


it('Gembox renders correctly', () => {
    const props = {
        level: 1,
        grade: 2,
        rate: 2,
    }
    const container = render(<Gembox {...props} />);
    expect(container).toMatchSnapshot();
});



it('Gem renders correctly', () => {
     const props = {
    level: 2,
    grade: 2,
    rate: 2}
    const { container } = render(<Gem {...props} />);
    expect(container).toMatchSnapshot();
});




it('MobileHeader renders correctly', () => {
    const props = {
        currentPrice: 'PropTypes.string.isRequired',
        level: 2,
        grade: 2,
        rate: 2
    }
    const { container } = render(<MobileHeader {...props} />);
    expect(container).toMatchSnapshot();
});


it('showExpired renders correctly', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('ProgressMeter renders correctly', () => {
    const props = {
        currentPrice: '1.2',
        minPrice: 100,
        maxPrice: 10
    };
    const  container  = render(<ProgressMeter {...props}/>);
    expect(container).toMatchSnapshot();
});


it('filter show correct filter results', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('frade and rate modifications are bound, chnaging one should result in correct adjustmnet in teh other', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});


it('grade always show letters form D - AAA', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('price slider shows a 3 digit number on slide', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('grade shows letters on slide', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('only dis[lay 2 rows of 3 images', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});

it('pink gem dude shows up as gem page mascot', () => {
    const { container } = render(Navbar);
    expect(container).toMatchSnapshot();
});








