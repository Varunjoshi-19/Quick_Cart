import { EmptyList } from '@/components/Cart';

function MyList() {

    const listName = "MY LIST";
    const listDesc = "My List is currently empty";


    return (


        <div>
            <EmptyList name='LIST' listDesc={listDesc} listName={listName} />
        </div>
    )
}

export default MyList