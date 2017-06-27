import React, {Component} from 'react'

class BookDetail extends Component {
		constructor(props) {
			super(props)
			this.state = {
				book: [],
				borrowers: []
			}
		}

		keepSynchronizing(db) {
			var that = this
			db.changes({
				live: true,
				since: 'now',
				include_docs: true
			}).on('change', function(change) {
				var updatedBook = change.doc
				that.setState({
					book: updatedBook,
					borrowers: updatedBook.borrowers
				})
			}).on('error', console.log.bind(console))
		}

		componentDidMount() {
			const {books} = this.props
			if(books && books.length) {
				const id = this.props.match.params.id

				if(books[id - 1] !== this.state.book) {
					var book = books[id - 1]

					this.setState({
						book: book,
						borrowers: book.borrowers
					})
				}
			}
		}

		componentWillReceiveProps(nextProps) {
			const id = nextProps.match.params.id
			var books = nextProps.books
			if(books[id - 1] !== this.state.book) {
				var book = books[id - 1]

				this.setState({
					book: book,
					borrowers: book.borrowers
				})
			}
		}

		componentDidUpdate() {
			const {db} = this.props
			this.keepSynchronizing(db)
		}

		render() {
				const {book, borrowers} = this.state
				return (
					<section id="single-project">
					   <div className="container">
					      <div className="row">

					         <div className="wow fadeInUp col-md-offset-1 col-md-3 col-sm-offset-1 col-sm-4" data-wow-delay="2.3s">
								 <div className="project-info">
 									<img src={book.cover} className="img-responsive" alt="book cover" />
									<div className="project-info">
										<p className="btn btn-default" disabled={borrowers.length ? true : false}>Mượn sách</p>
									</div>
 								</div>
							</div>

							<div className="wow fadeInUp col-md-7 col-sm-7" data-wow-delay="2.6s">

								   <h4>{book.name}</h4>

								   <h5>Tác giả: {book.author}</h5>

								   <h5>ISBN: {book.isbn}</h5>

								   <h5><span>Người mượn:</span>
                                   {borrowers.length ? (
                                       borrowers.map(function(borrower) {
                                           return (
                                               <img src={borrower.avatar} key={borrower.id} className="borrower-avatar" alt="avatar" />
                                           )
                                       })
                                   ) : (
                                       <span>Chưa có ai mượn sách này</span>
                                   )}</h5>

							   <hr />
								<p dangerouslySetInnerHTML={{__html: book.description}}></p>
							</div>

					      </div>
					   </div>
					</section>
				)
		}
}

export default BookDetail