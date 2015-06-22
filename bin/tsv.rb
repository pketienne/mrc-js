class TSV
  attr_accessor :uri, :column_labels, :records                

  def initialize(uri)
    @uri = uri
    @column_labels = []
    @records = []

    process_file
  end

  def process_file
    file_lines = IO.readlines(@uri)
    @column_labels = file_lines.shift.split("\t")
    file_lines.each do | record |
      @records.push(Record.new(record))
    end
  end
  
  def line_number_first_labels
    @records.map { |r| r.line_number_first_label }
  end

  def line_number_last_labels
    @records.map { |r| r.line_number_last_label }
  end

  def populate_ordinates!(legend)
    @records.each do |r|
      r.line_number_first_ordinate = legend.translation.index(r.line_number_first_label)
      r.line_number_last_ordinate = legend.translation.index(r.line_number_last_label)
    end
  end
  
end
